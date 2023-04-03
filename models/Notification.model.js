const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  notificator: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "User",
  },
  notificated: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "User",
  },
  type: {
    type: String,
    enum: ["Follow", "Message", "Like"],
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  read: {
    type: Boolean,
    default: false,
  },
  post: {
    type: mongoose.Types.ObjectId,
    ref: "Post",
  },
  date: {
    type: Date,
    default: Date.now(),
  },
});

const Notification = mongoose.model("Notification", notificationSchema);
module.exports = Notification;
