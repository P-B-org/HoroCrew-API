const mongoose = require("mongoose");

const compatibilitySchema = new mongoose.Schema(
  {
    signs: {
      type: [String],
      required: true,
    },
    love: {
      type: String,
      required: true,
    },
    loveRating: {
      type: String,
      required: true,
    },
    friendship: {
      type: String,
      required: true,
    },
    friendshipRating: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform: (doc, ret) => {
        delete ret.__v;
        delete ret._id;
      },
    },
  }
);

const Compatibility = mongoose.model("Compatibility", compatibilitySchema);
module.exports = Compatibility;
