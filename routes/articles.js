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
})

module.exports = router;


// reettik token : eyJhbGciOiJIUzI1NiJ9.NWVjNjkxZjBkNDA5NWExOGE3MzY1MmQy.0DPApmVG3LaIIk0fpQvheF0YnQhGI8lAo2QqYGqwJFQ


// jayanta token: eyJhbGciOiJIUzI1NiJ9.NWVjNmQyYjM1MGI1ZTk2OWU5MjQ5MmU0.bOXlvLcoq_OgumcCcqypz7jXEkoEirobo91CNZwjD0Y


// localhost:3000/api/articles/how-to-train-your-dragon-reettik97-69f7