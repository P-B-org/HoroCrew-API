const mongoose = require("mongoose");

const compatibilitySchema = new mongoose.Schema({
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
});

const Compatibility = mongoose.model("Compatibility", compatibilitySchema);
module.exports = Compatibility;
