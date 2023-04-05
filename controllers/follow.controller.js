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
