const mongoose = require("mongoose");

const followSchema = new mongoose.Schema(
  {
    follower: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    followed: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        delete ret.__v;
      },
    },
  }
);

const Follow = mongoose.model("Follow", followSchema);
module.exports = Follow;
