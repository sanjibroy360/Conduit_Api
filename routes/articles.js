var express = require("express");
var router = express.Router();

// Models
var User = require("../models/user");
var Article = require("../models/article");
var Comment = require("../models/comment");

var commentRouter = require("./comments");

// Middleware
var auth = require("../middleware/auth");

// Controller
var commentController = require("../controllers/commentController");
var articleController = require("../controllers/articleController");

// routes

router.get("/", articleController.getFilteredListOfArticles);

router.post("/", auth.verifyToken, articleController.createArticle);

router.get("/feed", auth.verifyToken, articleController.getFeed);

router.put("/:slug", auth.verifyToken, articleController.updateArticle);

router.post(
  "/:slug/favorite",
  auth.verifyToken,
  articleController.favouriteArticle
);

router.delete(
  "/:slug/favorite",
  auth.verifyToken,
  articleController.unfavouriteArticle
);

router.delete("/:slug", auth.verifyToken, articleController.deleteArticle);

router.get("/:slug", auth.verifyToken, articleController.getArticle);

// Comments

// router.use('/:slug/comments', commentRouter);

router.post(
  "/:slug/comments",
  auth.verifyToken,
  commentController.createComment
);

router.get("/:slug/comments", auth.verifyToken, commentController.getComment);

router.delete(
  "/:slug/comments/:id",
  auth.verifyToken,
  commentController.deleteComment
);

module.exports = router;
