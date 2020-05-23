var express = require("express");
var router = express.Router();

// Models
var User = require("../models/user");
var Article = require('../models/article');
var Comment = require('../models/comment');


// Middleware 
var auth = require("../middleware/auth");

// Controller
var commentController = require('../controllers/commentController');
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

router.post('/:slug/comments', auth.verifyToken, commentController.createComment);


router.get('/:slug/comments', auth.verifyToken, commentController.getComment);

router.delete('/:slug/comments/:id', auth.verifyToken, commentController.deleteComment);


module.exports = router;



