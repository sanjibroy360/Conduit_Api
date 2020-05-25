var User = require("../models/user");
var Article = require("../models/article");
var auth = require("../middleware/auth");

exports.registerUser = async function (req, res, next) {
  try {
    var user = await User.create(req.body);
    token = await auth.generateToken(user);

    console.log("Token: ", token);

    res.status(200).json({
      user: {
        email: user.email,
        token,
        username: user.username,
        bio: user.bio,
        image: user.image,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.userLogin = async function (req, res, next) {
  try {
    var { email, password } = req.body;
    var user = await User.findOne({ email });
    var token = await auth.generateToken(user);

    if (!user) return res.status(400).json("Invalid Email!");
    update
    if (user.verifyPassword(password)) {
      res.json({
        user: {
          email,
          username: user.username,
          token,
          bio: user.bio,
          image: user.image,
        },
      });
    } else {
      res.status(400).json({
        success: false,
        error: "Wrong Password!",
      });
    }
  } catch (error) {
    next(error);
  }
};

exports.followUser = async function (req, res, next) {
  try {
    var token = req.user;
    var currentUserId = req.user.userId;
    var currentUser = await User.findOne({ _id: currentUserId });

    if (currentUser.username !== req.params.username) {
      var user = await User.findOneAndUpdate(
        { username: req.params.username },
        { $addToSet: { follower: currentUserId } },
        { new: true }
      );

      if (!user) {
        res.status(400).json({
          success: false,
          error: "User does not exists!",
        });
      }

      currentUser = await User.findByIdAndUpdate(
        currentUserId,
        { $addToSet: { following: user.id } },
        { new: true }
      );

      res.json({
        profile: {
          username: user.username,
          bio: user.bio,
          image: user.image,
          following: user.follower.includes(currentUserId),
        },
      });
    } else {
      res.status(400).json({
        success: false,
        error: "One can not follow himself!",
      });
    }
  } catch (error) {
    next(error);
  }
};

exports.unfollowUser = async function (req, res, next) {
  try {
    var token = req.user.token;
    var currentUserId = req.user.userId;

    var user = await User.findOneAndUpdate(
      { username: req.params.username },
      { $pull: { follower: currentUserId } }
    );

    var currentUser = await User.findByIdAndUpdate(currentUserId, {
      $pull: { following: user.id },
    });

    res.json({
      profile: {
        username: user.username,
        bio: user.bio,
        image: user.image,
        following: user.follower.includes(currentUserId),
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.updateUser = async function (req, res, next) {
  try {
    console.log("Body: ", req.body);
    var updatedUser = await User.findByIdAndUpdate(req.user.userId, req.body, {
      new: true,
    });
    res.json({
      user: {
        email: updatedUser.email,
        token: req.user.token,
        username: updatedUser.username,
        bio: updatedUser.bio,
        image: updatedUser.image,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.getCurrentUser = async function (req, res, next) {
  try {
    var user = await User.findById(req.user.userId);
    return res.status(200).json({
      user: {
        email: user.email,
        username: user.username,
        token: req.user.token,
        bio: user.bio,
        image: user.image,
      },
    });
  } catch (error) {
    next(error);
  }
};
