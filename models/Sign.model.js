const mongoose = require("mongoose");

const signSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  sun: {
    type: String,
    required: true,
  },
  moon: {
    type: String,
    required: true,
  },
  ascendant: {
    type: String,
    required: true,
  },
});

const Sign = mongoose.model("Sign", signSchema);
module.exports = Sign;
