var express = require("express");
var router = express.Router();
var User = require("../models/user");
var auth = require("../middleware/auth");
var userController = require("../controllers/userController");

// , auth.generateToken
/* GET users listing. */

router.post("/register", userController.registerUser);

router.post("/login", userController.userLogin);

module.exports = router;
