const User = require("../models/User.model");
const Post = require("../models/Post.model");
const Like = require("../models/Like.model");
const Comment = require("../models/Comment.model");
const Notification = require("../models/Notification.model");

const { StatusCodes, NO_CONTENT } = require("http-status-codes");
const createError = require("http-errors");

const authError = createError(
  StatusCodes.UNAUTHORIZED,
  "You are not the owner or it doesn't exist"
);

//CREATE POST
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

//DELETE POST
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
        next(authError);
      }
    })
    .catch(next);
};

//LIKE POST
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

//COMMENT POST
module.exports.commentPost = (req, res, next) => {
  const comment = {
    ...req.body,
    user: req.currentUserId,
    post: req.params.id,
  };

  Comment.create(comment)
    .then((comment) => {
      res.status(StatusCodes.CREATED).json(`New comment created: ${comment}`);
    })
    .catch(next);
};

//DELETE COMMENT
module.exports.deleteComment = (req, res, next) => {
  Comment.findOne({
    $and: [{ user: req.currentUserId }, { _id: req.params.id }],
  })
    .then((comment) => {
      if (comment) {
        return Comment.findByIdAndDelete(comment).then((deleteComment) => {
          res
            .status(StatusCodes.NO_CONTENT)
            .json(`Comment deleted: ${deleteComment}`);
        });
      } else if (!comment) {
        next(authError);
      }
    })
    .catch(next);
};

//GET POST WITH COMMENTS
module.exports.postWithComments = (req, res, next) => {
  Post.findById(req.params.id)
    .then((post) => {
      if (post) {
        res.json(post);
      } else if (!post) {
        next(authError);
      }
    })
    .catch(next);
};
