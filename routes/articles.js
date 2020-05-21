var express = require("express");
var router = express.Router();
var Article = require('../models/article');
var User = require("../models/user");
var auth = require("../middleware/auth");

router.post('/', auth.verifyToken  ,async function(req, res, next) {
    
    try {

        req.body.author = req.user.userId; 
        var article = await Article.create(req.body);

        res.json(
           article.articleResponse(req.user.userId) 
        );
        
    } catch (error) {
        next(error);
    }

})


module.exports = router;


// reettik token : eyJhbGciOiJIUzI1NiJ9.NWVjNjkxZjBkNDA5NWExOGE3MzY1MmQy.0DPApmVG3LaIIk0fpQvheF0YnQhGI8lAo2QqYGqwJFQ
