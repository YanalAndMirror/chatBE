const User = require("../models/User");
const Room = require("../models/Room");

const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");

// @desc Get user rooms
// @route GET /api/v1/rooms/user/:userId
// @access Private
exports.getUserRooms = asyncHandler(async (req, res, next) => {
  const rooms = await Room.find({
    users: { $in: [`${req.params.userId}`] },
  })
    .populate("users")
    .populate({ path: "messages", populate: { path: "user" } });
  res.status(201).json(rooms);
});

// @desc Get room
// @route GET /api/v1/rooms/:roomId
// @access Private
exports.getRoom = asyncHandler(async (req, res, next) => {
  const room = await Room.findById(req.params.roomId);
  if (!room) {
    next(
      new ErrorResponse(`room not found with id of ${req.params.roomId}`, 404)
    );
  } else {
    res.status(201).json(room);
  }
});

// @desc Create room
// @route POST /api/v1/rooms/user/:userId
// @access Private
exports.createRoom = asyncHandler(async (req, res, next) => {
  if (req.file) {
    req.body.photo = `http://${req.get("host")}/upload/${req.file.filename}`;
  }

  const to = await User.findOne({ phoneNumber: req.body.to });
  req.body = {
    ...req.body,
    users: [to._id, req.params.userId],
  };
  let room = await Room.create(req.body);
  room = await room.populate("users").execPopulate();
  res.status(201).json(room);
});

// @desc add user to group
// @route POST /api/v1/rooms/:roomId/add
// @access Private
exports.addUserToGroup = asyncHandler(async (req, res, next) => {
  const to = await User.findOne({ phoneNumber: req.body.to });
  let room = await Room.findByIdAndUpdate(req.params.roomId, {
    $push: { users: to._id },
  });
  room = await room.populate("users").execPopulate();
  res.status(201).json(room);
});

// @desc remove user from group
// @route POST /api/v1/rooms/:roomId/remove
// @access Private
exports.removeUserFromGroup = asyncHandler(async (req, res, next) => {
  const to = await User.findOne({ phoneNumber: req.body.to });
  let room = await Room.findByIdAndUpdate(req.params.roomId, {
    $pull: { users: to._id },
  });
  room = await room.populate("users").execPopulate();
  res.status(201).json(room);
});

// @desc delete room
// @route DELETE /api/v1/rooms/:roomId
// @access Private
exports.deleteRoom = asyncHandler(async (req, res, next) => {
  const room = await Room.findById(req.params.roomId);
  if (!room) {
    next(
      new ErrorResponse(`room not found with id of ${req.params.roomId}`, 404)
    );
  } else {
    room.remove();
    res.status(201).json({ msg: "deleted" });
  }
});
