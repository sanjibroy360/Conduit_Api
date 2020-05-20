var User = require('../models/user');
var auth = require('../middleware/auth');

exports.registerUser =  async function(req, res, next) {
                            try {
                            var user = await User.create(req.body);
                            token = await auth.generateToken(user);
                        
                            console.log("Token: ", token);
                        
                            res.status(200).json({
                                "user": {
                                "email": user.email,
                                token,
                                "username": user.username,
                                "bio": user.bio,
                                "image": user.image,
                                }
                            });
                        
                            } catch (error) {
                                next(error);
                            }
                        };

exports.userLogin = async function(req, res, next) {
                        try {
                            var {email, password} = req.body;
                            var user = await User.findOne({email});
                            var token = await auth.generateToken(user);
                        
                            if(!user) return res.status(400).json("Invalid Email!");
                        
                            if(user.verifyPassword(password)) {
                                res.json({
                                "user": {
                                    email,
                                    "username": user.username,
                                    token,
                                    "bio": user.bio,
                                    "image": user.image,
                                }
                                })
                            } else {
                                res.status(400).json({
                                    success: false,
                                    error: "Wrong Password!"
                                })
                            }
                        } catch (error) {
                            next(error);
                        }
                    };

exports.followUser = async function(req, res, next) {

                        try {
                            var token = req.user;
                            var currentUserId = req.user.userId;
                            var currentUser = await User.findOne({_id : currentUserId});
                        
                            if(currentUser.username !== req.params.username) {
                        
                                var user = await User.findOneAndUpdate({username: req.params.username}, {$addToSet: {follower : currentUserId}}, {new: true});
                        
                                if(!user) {
                                res.status(400).json({
                                    success: false,
                                    error: "User does not exists!"
                                });
                                }
                            
                                currentUser = await User.update({_id: currentUserId},{$addToSet: {following: user.id}},{new: true});
                            
                            
                                res.json({
                                    
                                "profile": {
                                    "username": user.username,
                                    "bio": user.bio,
                                    "image": user.image,
                                    "following": user.follower.includes(currentUserId)
                                }
                                
                                })
                        
                            } else {
                                res.status(400).json({
                                    success: false,
                                    error: "One can not follow himself!"
                                });
                            }
                    
                        } catch (error) {
                            next(error);
                        }
                    };