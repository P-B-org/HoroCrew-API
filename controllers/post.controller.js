const Post = require("../models/Post.model");
const Like = require("../models/Like.model");

const { StatusCodes } = require("http-status-codes");
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

// module.exports.like = (req, res, next) => {
//   const user = req.user.id;
//   const post = req.params.id;

//   const like = {
//     user,
//     post,
//   };

//   Like.findOne({ user, post })
//     .then((dbLike) => {
//       if (dbLike) {
//         return Like.findByIdAndDelete(dbLike.id).then((createdLike) => {
//           res.status(204).json({ deleted: true });
//         });
//       } else {
//         return Like.create(like).then(() => {
//           res.status(201).json({ deleted: false });
//         });
//       }
//     })
//     .catch((err) => next(err));
// };

// module.exports.doDelete = (req, res, next) => {
//   Post.findByIdAndDelete(req.params.id)
//     .then((post) => {
//       res.send("Post deleted");
//     })
//     .catch(next);
// };
