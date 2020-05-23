var User = require('../models/user');
var Article = require('../models/article');
var Comment = require('../models/comment');

// Auth
var auth = require('../middleware/auth');

exports.createComment = async function (req, res, next) {

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
                        };

exports.getComment = async function (req, res, next) {
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
                    };

exports.deleteComment = async function (req, res, next) {
                           
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
                        };