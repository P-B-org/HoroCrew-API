const Post = require("../models/Post.model");
const Like = require("../models/Like.model");
const Comment = require("../models/Comment.model");
const Notification = require("../models/Notification.model");

const { StatusCodes } = require("http-status-codes");
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

  if (req.files) {
    newPost.images = req.files.map((file) => {
      return file.path;
    });
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
          return Like.find({ post: post }).then((likes) => {
            likes.forEach((like) => like.deleteOne());
            return Comment.find({ post: post }).then((comments) => {
              comments.forEach((comment) => comment.deleteOne());
              res.json("post deleted");
            });
          });
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
    .then(async (dbLike) => {
      if (dbLike) {
        return Like.findByIdAndDelete(dbLike._id)
          .populate("post")
          .then((deleteLike) => {
            return Notification.findOne({
              $and: [
                { notificator: deleteLike.user },
                { notificated: deleteLike.post.user },
                { type: "Like" },
              ],
            }).then((dbNotification) => {
              Notification.findByIdAndDelete(dbNotification).then(
                (deleteNotification) => {
                  res
                    .status(StatusCodes.NO_CONTENT)
                    .json(`Delete notification: ${deleteNotification}`);
                }
              );
            });
          });
      } else {
        const createdLike = await Like.create(like);
        await createdLike.populate("user post");
        Notification.create({
          notificator: createdLike.user,
          notificated: createdLike.post.user,
          type: "Like",
          message: `${createdLike.user.firstName} ${createdLike.user.lastName} liked your post`,
          post: createdLike.post,
          read: false,
        }).then((notification) => {
          res
            .status(StatusCodes.CREATED)
            .json(`Created like notification: ${notification}`);
        });
      }
    })
    .catch(next);
};

//COMMENT POST
module.exports.commentPost = async (req, res, next) => {
  const comment = {
    ...req.body,
    user: req.currentUserId,
    post: req.params.id,
  };

  const createdComment = await Comment.create(comment);
  await createdComment.populate("user post");
  Notification.create({
    notificator: createdComment.user,
    notificated: createdComment.post.user,
    type: "Comment",
    message: `${createdComment.user.firstName} ${createdComment.user.lastName} commented one of your posts`,
    post: createdComment.post,
    read: false,
  })
    .then((notification) => {
      res
        .status(StatusCodes.CREATED)
        .json(`Created comment notification: ${notification}`);
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
        return Comment.findByIdAndDelete(comment)
          .populate("post")
          .then((deleteComment) => {
            console.log(deleteComment);
            return Notification.findOne({
              $and: [
                { notificator: deleteComment.user },
                { notificated: deleteComment.post.user },
                { type: "Comment" },
              ],
            }).then((dbNotification) => {
              Notification.findByIdAndDelete(dbNotification).then(
                (deleteNotification) => {
                  res
                    .status(StatusCodes.NO_CONTENT)
                    .json(`Delete notification: ${deleteNotification}`);
                }
              );
            });
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
    .populate({
      path: "user",
      populate: [
        {
          path: "sunSign moonSign ascendantSign",
        },
      ],
    })
    .then((post) => {
      return Comment.find({ post: post._id })
        .populate("user")
        .then((comments) => {
          const postWithComments = {
            post,
            comments,
          };
          res.json(postWithComments);
        });
    })
    .catch(next);
};

//GET ALL POSTS
module.exports.getPosts = (req, res, next) => {
  Post.find()
    .sort({ createdAt: -1 })
    .populate({
      path: "user",
      populate: [
        {
          path: "sunSign moonSign ascendantSign",
        },
      ],
    })
    .then((posts) => {
      res.json(posts);
    })
    .catch(next);
};

//GET POST LIKES
module.exports.getPostLikes = (req, res, next) => {
  Post.findById(req.params.id)
    .then((post) => {
      Like.find({ post: post }).then((postLikes) => {
        res.json(postLikes);
      });
    })
    .catch(next);
};

//GET POST COMMENTS
module.exports.getPostComments = (req, res, next) => {
  Post.findById(req.params.id)
    .then((post) => {
      Comment.find({ post: post }).then((postComments) => {
        res.json(postComments);
      });
    })
    .catch(next);
};
