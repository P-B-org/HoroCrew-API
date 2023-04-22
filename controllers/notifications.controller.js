const Notification = require("../models/Notification.model");

module.exports.getNotifications = (req, res, next) => {
  Notification.find({
    $and: [
      { notificated: req.currentUserId },
      { type: { $ne: "Message" } },
      { notificator: { $ne: req.currentUserId } },
    ],
  })
    .sort({ createdAt: -1 })
    .populate("notificator")
    .then((notifications) => {
      res.json(notifications);
    })
    .catch(next);
};

module.exports.getMessageNotifications = (req, res, next) => {
  Notification.find({
    $and: [
      { notificated: req.currentUserId },
      { notificator: req.params.id },
      { type: "Message" },
    ],
  })
    .then((notifications) => {
      res.json(notifications);
    })
    .catch(next);
};

module.exports.readNotifications = (req, res, next) => {
  Notification.find({ notificated: req.currentUserId })
    .then((notifications) => {
      const unReadedNotifications = notifications.filter((n) => !n.read);

      Notification.updateMany({ user: req.currentUserId }, { read: true }).then(
        (updatedNts) => {
          const setNotifications = notifications.filter(
            (value, index, self) =>
              index === self.findIndex((t) => t.message === value.message)
          );

          const notificationsByRead = setNotifications.map((n) => {
            const isUnread = unReadedNotifications.find(
              (unReadNt) => unReadNt.id === n.id
            );
            if (!isUnread) {
              return { ...n._doc, read: false };
            } else {
              return { ...n._doc, read: true };
            }
          });
          res.json(notificationsByRead);
        }
      );
    })
    .catch(next);
};
