var mongoose = require("mongoose");
var User = require("../models/user");
var Schema = mongoose.Schema;

var articleSchema = new Schema(
  {
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },

    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    body: {
      type: String,
      required: true,
    },

    tagList: [
      {
        type: String,
        lowercase: true,
      },
    ],

    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    favoritedBy: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: "",
      },
    ],

    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",
        default: "",
      },
    ],
  },
  { timestamps: true }
);

articleSchema.pre("save", async function (next) {
  try {
    user = await User.findById(this.author);
    this.slug =
      this.title.split(" ").join("-") +
      "-" +
      user.username +
      "-" +
      this._id.toString().slice(-4);
    next();
  } catch (error) {
    next(error);
  }
});

articleSchema.methods.updateSlug = async function (title, article) {
  try {
    user = await User.findById(article.author);
    return (
      (await title.split(" ").join("-")) +
      "-" +
      user.username +
      "-" +
      article.id.toString().slice(-4)
    );
  } catch (error) {
    return error;
  }
};

articleSchema.methods.articleResponse = function (article, userId) {
  var obj = {
    article: {
      slug: article.slug,
      title: article.title,
      description: article.description,
      body: article.body,
      tagList: article.tagList,
      createdAt: article.createdAt,
      updatedAt: article.updatedAt,
      author: article.author,
      favorited: this.favoritedBy.includes(userId),
      favoritesCount: this.favoritedBy.length,
    },
  };

  return obj;
};

module.exports = mongoose.model("Article", articleSchema);
