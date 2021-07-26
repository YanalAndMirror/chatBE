const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    phoneNumber: {
      type: String,
      required: [true, 'Please add a phoneNumber'],
      unique: true,
      trim: true,
      maxlength: [50, 'phoneNumber can not be more than 50 characters'],
    },
    userName: {
      type: String,
      //   required: [true, 'Please add a userName'],
      //   unique: true,
      trim: true,
      default: '',
      maxlength: [50, 'userName can not be more than 50 characters'],
    },
    photo: {
      type: String,
      default: 'no-photo.jpg',
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
module.exports = mongoose.model('User', UserSchema);
