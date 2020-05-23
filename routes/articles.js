var express = require("express");
var router = express.Router();

// Models
var User = require("../models/user");
var Article = require('../models/article');
var Comment = require('../models/comment');


// Middleware 
var auth = require("../middleware/auth");

// Controller
// var commentController = require('../controllers/commentController');
var articleController = require('../controllers/articleController');

// routes

router.get('/', async function(req, res, next) {
    
    try {
        var filteredArticle = {};
        var noOfdata = req.query.limit || 20;

        console.log("Query: ", req.query.tag);

        if(req.query.tag) {

            filteredArticle = await Article.find({tagList: {$in: [req.query.tag] }})
                                           .populate("author","username bio image")
                                           .sort({updatedAt : -1})
                                           .limit(noOfdata);

        } else if(req.query.author) {

            var author = await User.findOne({username : req.query.author});
            
            if(author) {

                filteredArticle = await Article.find({author: author.id})
                                                .populate("author","username bio image")                
                                               .sort({updatedAt : -1})
                                               .limit(noOfdata);

            } else {
                res.json({
                    success: false,
                    error: "Please, enter a valid author"
                })
            }

        } else if(req.query.favorited) {
            
            var user = await User.findOne({username : req.query.favorited});
            
            if(user) {

                filteredArticle = await Article.find({favoritedBy : {$in : [user.id]}},"-comments")                                           
                                               .populate("author","username bio image")
                                              
                                               .sort({updatedAt : -1})
                                               .limit(noOfdata);

            } else {
                res.json({
                    success: false,
                    error: "Please, enter a valid username"
                })
            }

        }

        res.json({filteredArticle});

    } catch (error) {
        next(error);
    }
})

router.post('/', auth.verifyToken, articleController.createArticle);

router.get('/feed', auth.verifyToken, articleController.getFeed);

router.put('/:slug', auth.verifyToken, articleController.updateArticle);

router.post('/:slug/favorite', auth.verifyToken, articleController.favouriteArticle);

router.delete('/:slug/favorite', auth.verifyToken, articleController.unfavouriteArticle);

router.delete('/:slug', auth.verifyToken, articleController.deleteArticle);

router.get('/:slug', auth.verifyToken, articleController.getArticle);




// Comments

router.post('/:slug/comments', auth.verifyToken, async function (req, res, next) {

    try {
        var articleSlug = req.params.slug;
        var article = await Article.findOne({ slug: articleSlug });

        req.body.author = req.user.userId;
        req.body.article = article.slug;

        var comment = await Comment.create(req.body);
        console.log("Article: ", comment.id);


        article = await article.updateOne({ $push: { comments: comment.id } });

        comment = await Comment.findOne({ _id: comment.id })
            .populate("author", "username bio image following");

        res.json(comment.commentResponse(comment));

    } catch (error) {
        next(error);
    }
});


router.get('/:slug/comments', auth.verifyToken, async function (req, res, next) {
    try {
        var articleSlug = req.params.slug;
        var allComments = await Comment.find({ article: articleSlug }, "-article")
            .populate("author");

        res.json({
            "comments": allComments
        });

    } catch (error) {
        next(error);
    }
});

router.delete('/:slug/comments/:id', auth.verifyToken, async function (req, res, next) {
    console.log("in comment", req.params.id)
    try {
        var comment = await Comment.findById(req.params.id);

        console.log(comment);
        console.log("Author: ", comment.author);

        console.log("Current User: ", req.user.userId);

        if (comment.author.toString() == req.user.userId.toString()) {
           let deletedComment = await Comment.findByIdAndDelete(req.params.id);

            var updatedArticle = await Article.findOneAndUpdate({ slug: req.params.slug }, { $pull: { comments: req.params.id } });

            res.json({
                success: true,
                msg: "User deleted successfully!"
            });

        }

        res.json({
            success: false,
            msg: "Only author can delete article!"
        });


    } catch (error) {
        next(error);
    }
});


module.exports = router;


// sanjibroy360 :  eyJhbGciOiJIUzI1NiJ9.NWVjN2EwZTBkZDM4NTcyNWYwNDFjZDZh.4kjegYUOPuiZGl3YeYh8ZNchPhO0Nw96v2bMZU3ufuY

// reettik : eyJhbGciOiJIUzI1NiJ9.NWVjN2ExMWU5Y2I1MzgyNjViZmZlYzc1.ByMukR0AEyE4bUy0E8Qnmu73lZe6o6Tr51DCNfKIMHQ

// sayan : eyJhbGciOiJIUzI1NiJ9.NWVjN2ExM2UyZDY3NWQyNjhiMzFiM2Fj.CRMyeotSxZuv3ln7EuukdUjaaJHcy78YJtdqXJyTAVg