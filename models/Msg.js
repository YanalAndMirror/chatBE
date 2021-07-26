const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: [true, 'Please add a type'],
      enum: ['Text', 'Photo', 'File', 'Voice'],
    },
    content: {
      type: String,
      required: [true, 'Please add a content'],
    },
    chatId: {
      type: String,
      required: [true, 'Please add a chatId'],
    },
    from: {
      type: String,
      required: [true, 'Please add a from userId'],
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
