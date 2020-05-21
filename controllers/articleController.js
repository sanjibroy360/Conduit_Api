var User = require('../models/user');
var Article = require('../models/article');
var auth = require('../middleware/auth');


exports.createArticle = async function(req, res, next) {

                            try {

                                req.body.author = req.user.userId; 
                                var article = await Article.create(req.body);
                                
                                article = await Article.findById(article.id)
                                        .populate("author","email username bio image");
                                
                                res.json(article.articleResponse(article, req.user.userId));
                                
                            } catch (error) {
                                next(error);
                            }

                        };

exports.getFeed  =  async function(req, res, next) {
        
                        try {
                            var user = await User.findById(req.user.userId);
                            var allArticles = await Article.find({author: {$in: [user.following] }})
                                .sort({updatedAt: -1}) //1=> asc, -1=> desc
                                .limit(2);

                            res.json(allArticles);
                        } catch (error) {
                            next(error);
                        }
                    };

exports.updateArticle = async function(req, res, next) {
                            try {
                                var updatedArticle = await Article.findOneAndUpdate({slug: req.params.slug, author: req.user.userId}, req.body, {new: true});

                                res.json(updatedArticle.articleResponse(updatedArticle, req.user.userId))
                            } catch (error) {
                                next(error);
                            }
                        };

exports.favouriteArticle =  async function(req, res, next) {
                                try {
                                    var favoritedArticle = await Article.findOneAndUpdate({slug: req.params.slug}, {$addToSet:{favoritedBy : req.user.userId}},{new: true});

                                    var currentUser = await User.findByIdAndUpdate(req.user.userId, {$addToSet: {favoritedArticles: req.params.slug} }, {new: true});

                                    res.json(favoritedArticle.articleResponse(favoritedArticle, req.user.userId));

                                } catch (error) {
                                    next(error);
                                }
                            };

exports.unfavouriteArticle = async function(req, res, next) {
                                try {
                                    var unfavoritedArticle = await Article.findOneAndUpdate({slug: req.params.slug}, {$pull:{favoritedBy : req.user.userId}},{new: true});

                                    var currentUser = await User.findByIdAndUpdate(req.user.userId, {$pull: {favoritedArticles: unfavoritedArticle.id} }, {new: true});

                                    res.json(unfavoritedArticle.articleResponse(unfavoritedArticle, req.user.userId));

                                } catch (error) {
                                    next(error);
                                }
                             };

exports.deleteArticle = async function (req, res, next) {
                            try {
                                var slug = req.params.slug;

                                var article = await Article.findOneAndDelete({slug: req.params.slug, author: req.user.userId});
                                
                                if(!article) {

                                    var updateAllUser = await User.updateMany({favoritedArticles: {$in: [slug] }},{$pull : {favoritedArticles : slug}});

                                    res.json({
                                        success: false,
                                        error: "Only author can delete an article!"
                                    })
                                }
                                res.json({
                                    success: true,
                                    msg : "Article Deleted Successfully"
                                })

                            } catch (error) {
                                next(error);
                            }
                        };

exports.getArticle = async function(req, res, next) {
                                try {
                                    var article = await Article.findOne({slug: req.params.slug})
                                                        .populate("author", "username email bio image");
                                    res.json(article.articleResponse(article, req.user.userId));
                                } catch (error) {
                                    next(error);
                                }
                            }