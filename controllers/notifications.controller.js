const Notification = require("../models/Notification.model");

module.exports.getNotifications = (req, res, next) => {
  Notification.find({
    $and: [{ notificated: req.currentUserId }, { type: { $ne: "Message" } }],
  })
    .populate("notificator")
    .then((notifications) => {
      res.json(notifications);
    })
    .catch(next);
};
