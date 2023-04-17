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
    $and: [{ sender: req.currentUserId }, { receiver: req.params.id }],
    $and: [{ sender: req.params.id }, { receiver: req.currentUserId }],
  })
    .populate("sender receiver")
    .then((msgs) => {
      msgs.forEach((msg) => {
        msg.hour = moment(msg.createdAt).format("DD/MM/YY - hh:mm");
      });
      msgs.sort((a, b) => b.createdAt - a.createdAt);
      res.status(201).json(msgs);
    })
    .catch((err) => next(err));
};
