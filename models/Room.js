const mongoose = require("mongoose");

const ChatSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: [true, "Please add a type"],
      enum: ["Private", "Group"],
    },
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    name: {
      type: String,
      default: null,
      maxlength: [50, "userName can not be more than 50 characters"],
    },
    photo: {
      type: String,
      default: "no-photo.jpg",
    },
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
ChatSchema.virtual("messages", {
  ref: "Message",
  localField: "_id",
  foreignField: "room",
  justOne: false,
});
module.exports = mongoose.model("Chat", ChatSchema);
