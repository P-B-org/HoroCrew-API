const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
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
      enum: ["Follow", "Message", "Like", "Comment"],
      required: true,
    },
    message: {
      type: String,
    },
    read: {
      type: Boolean,
      default: false,
    },
    post: {
      type: mongoose.Types.ObjectId,
      ref: "Post",
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        delete ret.__v;
      },
    },
  }
);

const Notification = mongoose.model("Notification", notificationSchema);
module.exports = Notification;
