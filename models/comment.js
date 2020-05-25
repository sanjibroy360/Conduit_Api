var mongoose = require("mongoose");
var User = require("../models/user");
var Schema = mongoose.Schema;

var commentSchema = new Schema(
  {
    body: {
      type: String,
      required: [true, "Comment body is required"]
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true,"'Author' is required'"]
    },
    article: {
      type: String,
      required: [true, "Article's slug is required"]
    },
  },
  { timestamps: true }
);

commentSchema.methods.commentResponse = function (comment) {
  var obj = {
    comment: {
      id: comment.id,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
      body: comment.body,
      author: comment.author,
    },
  };
  return obj;
};

module.exports = mongoose.model("Comment", commentSchema);
