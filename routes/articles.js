var express = require("express");
var router = express.Router();

// Models

var Article = require('../models/article');
var User = require("../models/user");

// Middleware 

var auth = require("../middleware/auth");

// Controller

var articleController = require('../controllers/articleController');

// routes

router.post('/', auth.verifyToken, articleController.createArticle);

router.get('/feed', auth.verifyToken, articleController.getFeed);

router.put('/:slug', auth.verifyToken, articleController.updateArticle);

router.post('/:slug/favorite', auth.verifyToken, articleController.favouriteArticle);

router.delete('/:slug/favorite', auth.verifyToken, articleController.unfavouriteArticle);

router.delete('/:slug', auth.verifyToken, articleController.deleteArticle)

router.get('/:slug', auth.verifyToken, articleController.getArticle);

module.exports = router;


