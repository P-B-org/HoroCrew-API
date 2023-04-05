const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    body: {
      type: String,
      required: [true, "Your post must have some content!"],
      max: [500, "Your post must have a maximum of 500 characters!"],
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    image: {
      type: [String],
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

postSchema.virtual("likes", {
  ref: "Like",
  foreignField: "post",
  localField: "_id",
  justOne: false,
});

postSchema.virtual("comments", {
  ref: "Comment",
  foreignField: "post",
  localField: "_id",
  justOne: false,
});

const Post = mongoose.model("Post", postSchema);
module.exports = Post;
