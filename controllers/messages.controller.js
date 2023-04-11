const Message = require("../models/Message.model");
const Notification = require("../models/Notification.model");
const { StatusCodes } = require("http-status-codes");

module.exports.newMessage = (req, res, next) => {
  const sender = req.currentUserId;
  const receiver = req.params.id;

  const message = {
    ...req.body,
    sender: sender,
    receiver: receiver,
  };

  Message.create(message)
    .then((createdMessage) => {
      console.log(createdMessage);
      return Notification.create({
        notificator: sender,
        notificated: receiver,
        type: "Message",
        read: false,
      }).then((notification) => {
        res
          .status(StatusCodes.CREATED)
          .json(`Created like notification: ${notification}`);
      });
    })
    .catch(next);
};

module.exports.getMessages = (req, res, next) => {
  Message.find({
    $and: [{ sender: req.currentUserId }, { receiver: req.params.id }],
    $and: [{ sender: req.params.id }, { receiver: req.currentUserId }],
  })
    .populate("sender")
    .populate("receiver");
};
