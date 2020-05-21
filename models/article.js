var mongoose = require('mongoose');
var User = require("../models/user");
var Schema = mongoose.Schema;

var articleSchema = new Schema({
    slug : {
        type: String,
        unique: true,
        lowercase: true
    },

    title : {
        type: String,
        required: true,
    },

    description: {
        type: String,
        required: true,
    },

    body : {
        type: String,
        required: true,
    },

    tagList : {
        type : [String],
        lowercase : true 
    },

    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required : true
    },

    favoritedBy : [{
        type: String,
        default: ''
    }],


}, {timestamps : true});


articleSchema.pre("save", async function(next) {
   try {
        user = await User.findById(this.author);
        this.slug = this.title.split(' ').join('-') +"-"+ user.username +"-"+this._id.toString().slice(-4);
   } catch (error) {
        next(error);
   }
});

articleSchema.methods.articleResponse = function (userId){
    var article = this.article;
    console.log(article);
    var obj =  {
                    article,
                    favorited : article.favoritedBy.includes(userId),
                    favoritesCount : article.favoritedBy.length
               };
    
    return obj;
}

module.exports = mongoose.model("Article", articleSchema);