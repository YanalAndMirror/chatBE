const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
  {
    content: {
      type: mongoose.Schema.Types.Mixed,
      required: [true, "Please add a content"],
    },

    room: {
      type: mongoose.Schema.ObjectId,
      ref: "Room",
      required: true,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    receivers: [
      {
        _id: String,
        received: { type: Date, default: null },
        seen: { type: Date, default: null },
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
    deleted: {
      type: [String],
      default: [],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
module.exports = mongoose.model("Message", MessageSchema);
