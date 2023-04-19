const Message = require("../models/Message.model");
const Notification = require("../models/Notification.model");
const { StatusCodes } = require("http-status-codes");

module.exports.newMessage = (req, res, next) => {
  const newMessage = {
    ...req.body,
    receiver: req.params.id,
    sender: req.currentUserId,
  };

  console.log(newMessage);

  Message.create(newMessage)
    .then((createdMessage) => {
      console.log(createdMessage);
      return Notification.create({
        notificator: req.params.id,
        notificated: req.currentUserId,
        type: "Message",
        read: false,
      }).then((notification) => {
        res
          .status(StatusCodes.CREATED)
          .json(`Created message notification: ${notification}`);
      });
    })
    .catch(next);
};

module.exports.getMessages = (req, res, next) => {
  Message.find({
    $or: [
      { $and: [{ sender: req.currentUserId }, { receiver: req.params.id }] },
      { $and: [{ sender: req.params.id }, { receiver: req.currentUserId }] },
    ],
  })
    .populate("sender receiver")
    .sort({ createdAt: 1 })
    .then((msgs) => {
      res.status(201).json(msgs);
    })
    .catch((err) => next(err));
};
