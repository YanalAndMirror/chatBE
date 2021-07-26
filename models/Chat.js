const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: [true, 'Please add a type'],
      enum: ['Private', 'Group'],
    },
    users: {
      type: Array,
      required: [true, 'Please add users'],
      unique: true,
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
module.exports = mongoose.model('Chat', ChatSchema);
