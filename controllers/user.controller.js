const { USER_NOT_FOUND } = require("../config/errorMsg.config");
const createError = require("http-errors");
const { StatusCodes } = require("http-status-codes");

const User = require("../models/User.model");
const Like = require("../models/Like.model");
const Post = require("../models/Post.model");

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

module.exports.getUsers = (req, res, next) => {
  User.find({ _id: { $ne: req.currentUserId } })
    .then((users) => res.json(users))
    .catch(next);
};

module.exports.getCurrentUserPosts = (req, res, next) => {
  Post.find({ user: req.currentUserId })
    .sort({ createdAt: -1 })
    .then((posts) => {
      if (posts) {
        res.json(posts);
      } else if (!posts) {
        res.status(StatusCodes.NO_CONTENT).json("There are no posts yet");
      }
    })
    .catch(next);
};

module.exports.getUserPosts = (req, res, next) => {
  Post.find({ user: req.params.id })
    .populate("user")
    .then((posts) => {
      if (posts) {
        res.json(posts);
      } else if (!posts) {
        res.status(StatusCodes.NO_CONTENT).json("There are no posts yet");
      }
    })
    .catch(next);
};

module.exports.getCurrentUserLikes = (req, res, next) => {
  Like.find({ user: req.currentUserId })
    .populate({
      path: "post user sunSign moonSign ascendantSign",
      strictPopulate: false,
    })
    .then((postsLiked) => {
      if (postsLiked) {
        res.json(postsLiked);
      } else if (!postsLiked) {
        res.status(StatusCodes.NO_CONTENT).json("There are no likes yet");
      }
    })
    .catch(next);
};

module.exports.getUserLikes = (req, res, next) => {
  Like.find({ user: req.params.id })
    .populate("user")
    .then((postsLiked) => {
      if (postsLiked) {
        res.json(postsLiked);
      } else if (!postsLiked) {
        res.status(StatusCodes.NO_CONTENT).json("There are no likes yet");
      }
    })
    .catch(next);
};
