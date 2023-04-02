const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const {
  REQUIRED_FIELD,
  INVALID_EMAIL,
  INVALID_PASSWORD,
  ALREADY_IN_USE,
} = require("../config/errorMsg.config");

const SALT_ROUNDS = 10;
const EMAIL_PATTERN =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PASSWORD_PATTERN = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      match: [EMAIL_PATTERN, INVALID_EMAIL],
      required: [true, REQUIRED_FIELD],
      trim: true,
      lowercase: true,
      unique: [true, ALREADY_IN_USE],
    },
    password: {
      type: String,
      required: [true, REQUIRED_FIELD],
      match: [PASSWORD_PATTERN, INVALID_PASSWORD],
    },
    firstName: {
      type: String,
      required: [true, REQUIRED_FIELD],
    },
    lastName: {
      type: String,
      required: [true, REQUIRED_FIELD],
    },
    dayOfBirth: {
      type: Number,
      required: true,
    },
    monthOfBirth: {
      type: Number,
      required: true,
    },
    yearOfBirth: {
      type: Number,
      required: true,
    },
    timeOfBirth: {
      type: String,
      required: true,
    },
    sunSign: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "Sign",
    },
    moonSign: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "Sign",
    },
    ascendantSign: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "Sign",
    },
    image: {
      type: String,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        delete ret.__v;
        delete ret._id;
        delete ret.password;
      },
    },
  }
);

userSchema.pre("save", function (next) {
  const rawPassword = this.password;
  if (this.isModified("password")) {
    bcrypt
      .hash(rawPassword, SALT_ROUNDS)
      .then((hash) => {
        this.password = hash;
        next();
      })
      .catch((err) => next(err));
  } else {
    next();
  }
});

userSchema.methods.checkPassword = function (passwordToCompare) {
  return bcrypt.compare(passwordToCompare, this.password);
};

const User = mongoose.model("User", userSchema);
module.exports = User;
