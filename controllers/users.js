const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc Get all users
// @route GET /api/v1/users
// @access Public
exports.getUsers = asyncHandler(async (req, res, next) => {
  let query;
  const users = await User.find(query);
  res.status(201).json(users);
});

// @desc login user
// @route GET /api/v1/users/login
// @access Public
exports.loginUser = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ phoneNumber: req.body.phoneNumber });
  res.status(201).json(user);
});

// @desc Get single user
// @route GET /api/v1/user/:id
// @access Public
exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    next(new ErrorResponse(`user not found with id of ${req.params.id}`, 404));
  } else {
    res.status(201).json(user);
  }
});

// @desc Create users
// @route POST /api/v1/users/
// @access Private
exports.createUser = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);
  res.status(201).json(user);
});

// @desc Update user
// @route PUT /api/v1/users/:id
// @access Private
exports.updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!user) {
    next(new ErrorResponse(`user not found with id of ${req.params.id}`, 404));
  } else {
    res.status(201).json(user);
  }
});

// @desc Update user
// @route DELETE /api/v1/users/:id
// @access Private
exports.deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!bootcamp) {
    next(new ErrorResponse(`user not found with id of ${req.params.id}`, 404));
  } else {
    user.remove();
    res.status(201).json(user);
  }
});
