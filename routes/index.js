var express = require('express');
var router = express.Router();
var User = require('../models/user');
var auth = require('../middleware/auth');

// Controller

var userController = require('../controllers/userController');
var profileController = require('../controllers/profileController');

/* GET home page. */

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/api/user', auth.verifyToken, async function(req, res, next) {
  try {
    var user = User.findById(req.user.userId);
    return res.status(200).json({
            "user": {
              email: user.email,
              username: user.username,
              token: req.user.token,
              bio: user.bio,
              image: user.image
            }
          });
  } catch (error) {
      next(error);
  }
});

router.get('/api/profiles/:username', profileController.getProfile);

router.post('/api/profiles/:username/follow', auth.verifyToken, userController.followUser);

router.delete('/api/profiles/:username/follow', auth.verifyToken, userController.unfollowUser);

router.put('/api/user', auth.verifyToken, userController.updateUser)


module.exports = router;


