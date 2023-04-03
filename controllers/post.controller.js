const Post = require("../models/Post.model");
const Like = require("../models/Like.model");

// module.exports.doNewPost = (req, res, next) => {
//   const newPost = {
//     ...req.body,
//     user: req.user.id,
//   };

//   if (req.file) {
//     newPost.image = req.file.path;
//   }

//   Post.create(newPost)
//     .then((post) => {
//       res.redirect("/timeline");
//     })
//     .catch((err) => {
//       if (mongoose.Error.ValidationError) {
//         res.render("user/new-post", {
//           post: req.body.body,
//           errors: err.errors,
//         });
//       }
//       next(err);
//     });
// };

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
