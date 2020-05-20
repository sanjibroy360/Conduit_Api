var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var {hash, compare} = require('bcrypt');

var userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    
    username : {
        type: String,
        required: true,
        unique: true
    },

    bio : {
        type: String,
        maxlength: 150,
    },

    image: {
        type: String,
    },

    follower: [String],
    following: [String],

    password : {
        type: String,
        maxlength: 20,
        required: true
    }

}, {timestamps: true});

userSchema.pre("save", async function(next) {
    try {
        if(this.password || this.isModified("password")) {
            this.password = await hash(this.password, 10);
            return next();
        }
        next();
    } catch (error) {
        return next(error);
    }
});

userSchema.methods.verifyPassword = async(password) => {
    return await compare(password, this.password);
}



module.exports = mongoose.model("User", userSchema);

