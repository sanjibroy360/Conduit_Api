var User = require("../models/user");
var Article = require("../models/article");
var Comment = require("../models/comment");

var auth = require("../middleware/auth");

exports.createArticle = async function (req, res, next) {
  try {
    req.body.author = req.user.userId;
    var article = await Article.create(req.body);

    article = await Article.findById(article.id).populate(
      "author",
      "email username bio image"
    );

    res.json(article.articleResponse(article, req.user.userId));
  } catch (error) {
    next(error);
  }
};

exports.getFeed = async function (req, res, next) {
  try {
    var user = await User.findById(req.user.userId);
    var allArticles = await Article.find({ author: { $in: [user.following] } })
      .sort({ updatedAt: -1 }) //1=> asc, -1=> desc
      .limit(5);

    res.json(allArticles);
  } catch (error) {
    next(error);
  }
};

exports.updateArticle = async function (req, res, next) {
  try {
    var article = await Article.findOne({ slug: req.params.slug });

    if (article.author == req.user.userId) {
      if (article.title != req.body.title) {
        console.log("Check: ", 1);
        req.body.slug = await article.updateSlug(req.body.title, article);
      }
      console.log(req.body.slug);

      var updatedArticle = await Article.findByIdAndUpdate(
        article.id,
        req.body,
        { new: true }
      );
      console.log(updatedArticle);
      res.json(updatedArticle.articleResponse(updatedArticle, req.user.userId));
    }
  } catch (error) {
    next(error);
  }
};

exports.favouriteArticle = async function (req, res, next) {
  try {
    var favoritedArticle = await Article.findOneAndUpdate(
      { slug: req.params.slug },
      { $addToSet: { favoritedBy: req.user.userId } },
      { new: true }
    );

    var currentUser = await User.findByIdAndUpdate(
      req.user.userId,
      { $addToSet: { favoritedArticles: req.params.slug } },
      { new: true }
    );

    res.json(
      favoritedArticle.articleResponse(favoritedArticle, req.user.userId)
    );
  } catch (error) {
    next(error);
  }
};

exports.unfavouriteArticle = async function (req, res, next) {
  try {
    var unfavoritedArticle = await Article.findOneAndUpdate(
      { slug: req.params.slug },
      { $pull: { favoritedBy: req.user.userId } },
      { new: true }
    );

    var currentUser = await User.findByIdAndUpdate(
      req.user.userId,
      { $pull: { favoritedArticles: unfavoritedArticle.id } },
      { new: true }
    );

    res.json(
      unfavoritedArticle.articleResponse(unfavoritedArticle, req.user.userId)
    );
  } catch (error) {
    next(error);
  }
};

exports.deleteArticle = async function (req, res, next) {
  try {
    var slug = req.params.slug;

    var article = await Article.findOne({ slug: req.params.slug });

    if (article && article.author == req.user.userId) {
      var updateAllUser = await User.updateMany(
        { favoritedArticles: { $in: [slug] } },
        { $pull: { favoritedArticles: slug } },
        { new: true }
      );
      var deleteAllComments = await Comment.deleteMany({
        article: req.params.slug,
      });
      var deletedArticle = await Article.findByIdAndDelete(article.id);

      res.json({
        success: true,
        msg: "Article Deleted Successfully",
      });
    }
    res.json({
      success: false,
      error: "Only author can delete an article!",
    });
  } catch (error) {
    next(error);
  }
};

exports.getArticle = async function (req, res, next) {
  try {
    var article = await Article.findOne({ slug: req.params.slug }).populate(
      "author",
      "username email bio image"
    );
    res.json(article.articleResponse(article, req.user.userId));
  } catch (error) {
    next(error);
  }
};

exports.getAllTags = async function (req, res, next) {
  try {
    var filteredArticle = await Article.find({}, "tagList");
    var allTags = filteredArticle.map((obj) => obj.tagList).flat();

    res.json({
      tags: allTags,
    });
  } catch (error) {
    next(error);
  }
};

exports.getFilteredListOfArticles = async function (req, res, next) {
  try {
    var filteredArticle = {};
    var noOfdata = req.query.limit || 20;

    if (req.query.tag) {
      filteredArticle = await Article.find({
        tagList: { $in: [req.query.tag] },
      })
        .populate("author", "username bio image")
        .sort({ updatedAt: -1 })
        .limit(noOfdata);
    } else if (req.query.author) {
      var author = await User.findOne({ username: req.query.author });

      if (author) {
        filteredArticle = await Article.find({ author: author.id })
          .populate("author", "username bio image")
          .sort({ updatedAt: -1 })
          .limit(noOfdata);
      } else {
        res.json({
          success: false,
          error: "Please, enter a valid author",
        });
      }
    } else if (req.query.favorited) {
      var user = await User.findOne({ username: req.query.favorited });

      if (user) {
        filteredArticle = await Article.find(
          { favoritedBy: { $in: [user.id] } },
          "-comments"
        )
          .populate("author", "username bio image")
          .sort({ updatedAt: -1 })
          .limit(noOfdata);
      } else {
        res.json({
          success: false,
          error: "Please, enter a valid username",
        });
      }
    }

    res.json({ filteredArticle });
  } catch (error) {
    next(error);
  }
};
