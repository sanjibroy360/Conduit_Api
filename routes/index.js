var express = require("express");
var router = express.Router();
var User = require("../models/user");
var Article = require("../models/article");
var auth = require("../middleware/auth");

// Controller

var userController = require("../controllers/userController");
var profileController = require("../controllers/profileController");
var articleController = require("../controllers/articleController");

/* GET home page. */

router.get("/api/user", auth.verifyToken, userController.getCurrentUser);

router.get("/api/profiles/:username", profileController.getProfile);

router.post(
  "/api/profiles/:username/follow",
  auth.verifyToken,
  userController.followUser
);

router.delete(
  "/api/profiles/:username/follow",
  auth.verifyToken,
  userController.unfollowUser
);

router.put("/api/user", auth.verifyToken, userController.updateUser);

router.get("/api/tags", articleController.getAllTags);

module.exports = router;
