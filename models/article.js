var mongoose = require("mongoose");
var User = require("../models/user");
var Schema = mongoose.Schema;

var articleSchema = new Schema(
  {
    slug: {
      type: String,
      lowercase: true,
    },

    title: {
      type: String,
      required: [true, "'title' is required"],
    },

    description: {
      type: String,
      required: [true, "'Description' is required"],
    },

    body: {
      type: String,
      required: [true, "'Body' is required"],
    },

    tagList: [
      {
        type: String,
        lowercase: true,
        trim: true,
      },
    ],

    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "'Author' is required"],
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
    console.log("Slug beginning: ", this.slug);
    user = await User.findById(this.author);
    this.slug =
      this.title.split(" ").join("-") +
      "-" +
      user.username +
      "-" +
      this._id.toString().slice(-4);
    console.log("Slug end: ", this.slug);

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
