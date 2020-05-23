var User = require("../models/user");
var auth = require("../middleware/auth");

exports.getProfile = async function (req, res, next) {
  try {
    var user = await User.findOne({ username: req.params.username });
    var token = await auth.generateToken(user);
    return res.status(200).json({
      user: {
        email: user.email,
        username: user.username,
        token,
        bio: user.bio,
        image: user.image,
      },
    });
  } catch (error) {
    next(error);
  }
};
