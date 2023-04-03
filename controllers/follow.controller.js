const Follow = requiere("../models/Follow.model.js");
const { StatusCodes } = require("http-status-codes");

module.exports.follow = (req, res, next) => {
  const follower = req.currentUserId;
  const followed = req.params.id;

  const follow = {
    follower,
    followed,
  };

  Follow.findOne({ follower, followed })
    .then((dbFollow) => {
      if (dbFollow) {
        return Follow.findByIdAndDelete(dbFollow.id).then((deletedFollow) =>
          res
            .status(StatusCodes.NO_CONTENT)
            .json(`Delete follow: ${deletedFollow}`)
        );
      } else {
        return Follow.create(follow).then((follow) => {
          res.status(StatusCodes.CREATED).json(`Created follow: ${follow}`);
        });
      }
    })
    .catch(next);

  // Follow.findOne({ follower, followed })
  //   .then((dbFollow) => {
  //     if (dbFollow) {
  //       return Follow.findByIdAndDelete(dbFollow.id)
  //       .then((createdFollow) => {
  //         res.status(204).json({ deleted: true });
  //       });
  //     } else {
  //       return Follow.create(follow)
  //       .then(() => {
  //         Notification.create({ user: followed, message: `${req.user.firstName} followed you`, read: false })
  //         .then((notification) => {
  //             res.status(201).json({ ok: true });
  //         })
  //       });
  //     }
  //   })
  //   .catch(next);
};
