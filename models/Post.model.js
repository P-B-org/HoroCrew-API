const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    body: {
      type: String,
      required: [true, "Your post must have some content!"],
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

const Post = mongoose.model("Post", postSchema);
module.exports = Post;
