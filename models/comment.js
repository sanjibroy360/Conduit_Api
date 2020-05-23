var mongoose = require('mongoose');
var User = require("../models/user");
var Schema = mongoose.Schema;

var commentSchema = new Schema({
    body: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    article: {
        type: String
    }
}, {timestamps: true});


commentSchema.methods.commentResponse = function(comment){
    var obj = {
        "comment": {
            "id": comment.id,
            "createdAt": comment.createdAt,
            "updatedAt": comment.updatedAt,
            "body": comment.body,
            "author": comment.author
        }
    };
    return obj;
}

module.exports = mongoose.model("Comment",commentSchema);


