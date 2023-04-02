const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "A like must have a user"],
    },
    post: {
      type: mongoose.Types.ObjectId,
      ref: "Post",
      required: [true, "A like must have a post"],
    },
  },
  {
    timestamps: true,
  }
);

const Like = mongoose.model("Like", likeSchema);

module.exports = Like;
