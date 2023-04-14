const Follow = require("../models/Follow.model.js");
const Notification = require("../models/Notification.model");
const User = require("../models/User.model");

const { StatusCodes } = require("http-status-codes");
const createError = require("http-errors");
const { USER_NOT_FOUND } = require("../config/errorMsg.config.js");

const NOT_FOUND_ERROR = createError(StatusCodes.NOT_FOUND, USER_NOT_FOUND);

module.exports.follow = (req, res, next) => {
  const follower = req.currentUserId;
  const followed = req.params.id;

  const follow = {
    follower,
    followed,
  };

  Follow.findOne({ $and: [{ follower: follower }, { followed: followed }] })
    .then((dbFollow) => {
      if (dbFollow) {
        return Follow.findByIdAndDelete(dbFollow._id).then(() => {
          return Notification.findOne({
            $and: [
              { notificator: follower },
              { notificated: followed },
              { type: "Follow" },
            ],
          }).then((dbNotification) => {
            if (dbNotification) {
              return Notification.findByIdAndDelete(dbNotification._id).then(
                (deleteNotification) => {
                  res
                    .status(StatusCodes.NO_CONTENT)
                    .json(`Delete notification: ${deleteNotification}`);
                }
              );
            }
          });
        });
      } else if (follower === followed) {
        next(
          createError(StatusCodes.BAD_REQUEST, "You can't follow yourself :(")
        );
      } else {
        return Follow.create(follow).then(() => {
          return User.findById(follower).then((user) => {
            Notification.create({
              notificator: follower,
              notificated: followed,
              type: "Follow",
              message: `${user.firstName} ${user.lastName} followed you`,
              read: false,
            }).then((notification) => {
              res
                .status(StatusCodes.CREATED)
                .json(`Created follow notification: ${notification}`);
            });
          });
        });
      }
    })
    .catch(next);
};

module.exports.getCurrentUserFollowers = (req, res, next) => {
  User.findById(req.currentUserId)
    .then((user) => {
      if (!user) {
        next(NOT_FOUND_ERROR);
      } else if (user) {
        return Follow.find({ followed: user })
          .populate("follower")
          .then((followers) => {
            if (followers) {
              res.json(followers);
            } else {
              res.status(StatusCodes.NO_CONTENT).json("No content");
            }
          });
      }
    })
    .catch(next);
};

module.exports.getCurrentUserFolloweds = (req, res, next) => {
  User.findById(req.currentUserId)
    .then((user) => {
      if (!user) {
        next(NOT_FOUND_ERROR);
      } else if (user) {
        return Follow.find({ follower: user })
          .populate("followed")
          .then((followeds) => {
            if (followeds) {
              res.json(followeds);
            } else {
              res.status(StatusCodes.NO_CONTENT).json("No content");
            }
          });
      }
    })
    .catch(next);
};

module.exports.getUserFollowers = (req, res, next) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        next(NOT_FOUND_ERROR);
      } else if (user) {
        return Follow.find({ followed: user })
          .populate("follower")
          .then((followers) => {
            if (followers) {
              res.json(followers);
            } else {
              res.status(StatusCodes.NO_CONTENT).json("No content");
            }
          });
      }
    })
    .catch(next);
};

module.exports.getUserFolloweds = (req, res, next) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        next(NOT_FOUND_ERROR);
      } else if (user) {
        return Follow.find({ follower: user })
          .populate("followed")
          .then((followeds) => {
            if (followeds) {
              res.json(followeds);
            } else {
              res.status(StatusCodes.NO_CONTENT).json("No content");
            }
          });
      }
    })
    .catch(next);
};
