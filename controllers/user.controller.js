const { USER_NOT_FOUND } = require("../config/errorMsg.config");
const createError = require("http-errors");
const { StatusCodes } = require("http-status-codes");

const User = require("../models/User.model");

const NOT_FOUND_ERROR = createError(StatusCodes.NOT_FOUND, USER_NOT_FOUND);

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.currentUserId)
    .populate("sunSign moonSign ascendantSign")
    .then((user) => {
      if (!user) {
        next(NOT_FOUND_ERROR);
      } else {
        res.json(user);
      }
    })
    .catch(next);
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        next(NOT_FOUND_ERROR);
      } else {
        res.json(user);
      }
    })
    .catch(next);
};

module.exports.getUsers = (req, res, next) => {
  User.find({ _id: { $ne: req.currentUserId } })
    .then((users) => res.json(users))
    .catch(next);
};
