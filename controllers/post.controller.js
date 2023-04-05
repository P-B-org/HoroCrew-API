const Post = require("../models/Post.model");
const Like = require("../models/Like.model");
const User = require("../models/User.model");
const Notification = require("../models/Notification.model");

const { StatusCodes, NO_CONTENT } = require("http-status-codes");
const createError = require("http-errors");

module.exports.newPost = (req, res, next) => {
  const newPost = {
    ...req.body,
    user: req.currentUserId,
  };

  if (req.file) {
    newPost.image = req.file.path;
  }

  Post.create(newPost)
    .then((post) => {
      res.status(StatusCodes.CREATED).json(`New post created: ${post}`);
    })
    .catch(next);
};

module.exports.deletePost = (req, res, next) => {
  Post.findOne({
    $and: [{ user: req.currentUserId }, { _id: req.params.id }],
  })
    .then((post) => {
      if (post) {
        return Post.findByIdAndDelete(post).then((post) => {
          res.status(StatusCodes.NO_CONTENT).json(`Post deleted: ${post}`);
        });
      } else if (!post) {
        next(
          createError(
            StatusCodes.UNAUTHORIZED,
            "You are not the owner of this post or it doesn't exist"
          )
        );
      }
    })
    .catch(next);
};

module.exports.likePost = (req, res, next) => {
  const user = req.currentUserId;
  const post = req.params.id;

  const like = {
    user,
    post,
  };

  Like.findOne({ $and: [{ user: user }, { post: post }] })
    .then((dbLike) => {
      if (dbLike) {
        return Like.findByIdAndDelete(dbLike._id).then(() => {
          return Post.findById(post).then((postFound) => {
            return Notification.findOne({
              $and: [
                { notificator: user },
                { notificated: postFound.user },
                { type: "Like" },
              ],
            }).then((dbNotification) => {
              if (dbNotification) {
                Notification.findByIdAndDelete(dbNotification._id).then(
                  (deleteNotification) => {
                    res
                      .status(StatusCodes.NO_CONTENT)
                      .json(`Delete notification: ${deleteNotification}`);
                  }
                );
              }
            });
          });
        });
      } else {
        return Like.create(like).then(() => {
          return User.findById(user).then((foundUser) => {
            return Post.findById(post).then((postFound) => {
              Notification.create({
                notificator: foundUser,
                notificated: postFound.user,
                type: "Like",
                message: `${foundUser.firstName} ${foundUser.lastName} liked your post`,
                post: post,
                read: false,
              }).then((notification) => {
                res
                  .status(StatusCodes.CREATED)
                  .json(`Created like notification: ${notification}`);
              });
            });
          });
        });
      }
    })
    .catch(next);
};
