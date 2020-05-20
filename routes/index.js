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

router.delete('/api/profiles/:username/follow', auth.verifyToken, async function(req, res, next) {
  try {
    var token = req.user.token;
    var currentUserId = req.user.userId;
    var user = await User.findOne({username : req.params.username});
    var currentUser = await User.findOne({_id : req.user.userId});

    if(currentUser.username !== req.params.username) {
      user = await User.update({username : req.params.username}, {$pull:{follower : currentUserId}}, {new:true});
      
      currentUser = await User.update({_id: currentUserId}, {$pull:{following : user.id}}, {new: user});

      res.json({
                                    
        "profile": {
            "username": user.username,
            "bio": user.bio,
            "image": user.image,
            "following": user.follower.includes(currentUserId);

        }
        
      })
    }
    
  } catch (error) {
      next(error);
  }
})

module.exports = router;




// localhost:3000/api/profiles/sanjib2/follow

// localhost:3000/api/users/register