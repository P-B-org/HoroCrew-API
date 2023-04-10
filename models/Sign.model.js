const mongoose = require("mongoose");

const signSchema = new mongoose.Schema(
  {
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

const Sign = mongoose.model("Sign", signSchema);
module.exports = Sign;
