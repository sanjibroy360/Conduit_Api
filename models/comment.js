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


// sanjibroy360 :  eyJhbGciOiJIUzI1NiJ9.NWVjN2EwZTBkZDM4NTcyNWYwNDFjZDZh.4kjegYUOPuiZGl3YeYh8ZNchPhO0Nw96v2bMZU3ufuY

// reettik : eyJhbGciOiJIUzI1NiJ9.NWVjN2ExMWU5Y2I1MzgyNjViZmZlYzc1.ByMukR0AEyE4bUy0E8Qnmu73lZe6o6Tr51DCNfKIMHQ

// sayan : eyJhbGciOiJIUzI1NiJ9.NWVjN2ExM2UyZDY3NWQyNjhiMzFiM2Fj.CRMyeotSxZuv3ln7EuukdUjaaJHcy78YJtdqXJyTAVg