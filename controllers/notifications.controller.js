const Follow = require("../models/Follow.model.js");
const Notification = require("../models/Notification.model");
const User = require("../models/User.model");
const { StatusCodes } = require("http-status-codes");

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
        return Follow.findByIdAndDelete(dbFollow._id).then((deletedFollow) => {
          res
            .status(StatusCodes.NO_CONTENT)
            .json(`Delete follow: ${deletedFollow}`);
        });
      } else {
        return Follow.create(follow).then(async () => {
          return await Notification.findOne({
            $and: [
              { notificator: follower },
              { notificated: followed },
              { type: "Follow" },
            ],
          }).then((dbNotification) => {
            if (dbNotification) {
              return Notification.findByIdAndDelete(dbNotification._id).then(
                (deletedNotification) =>
                  res
                    .status(StatusCodes.NO_CONTENT)
                    .json(`Delete notification: ${deletedNotification}`)
              );
            } else {
              return User.findById(req.currentUserId).then((user) => {
                console.log(user);
                Notification.create({
                  notificator: follower,
                  notificated: followed,
                  type: "Follow",
                  message: `${req.currentUserId} followed you`,
                  read: false,
                }).then((notification) => {
                  res
                    .status(StatusCodes.NO_CONTENT)
                    .json(`Created follow notification: ${notification}`);
                });
              });
            }
          });
        });
      }
    })
    .catch(next);
};
