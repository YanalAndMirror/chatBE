const User = require("../models/User");
const Room = require("../models/Room");
const Message = require("../models/Message");
const CryptoJS = require("crypto-js");
const nodeCrypto = require("create-ecdh");
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
    .populate({
      path: "messages",
      populate: { path: "user" },
      match: { deleted: { $nin: [req.params.userId] } },
    });
  if (req.body.publicKey) {
    let server = nodeCrypto("secp256k1");
    server.generateKeys();
    let publicKey = server.getPublicKey(null, "compressed");
    let secretKey = server
      .computeSecret(Buffer.from(req.body.publicKey))
      .toString("hex");
    let ciphertext = CryptoJS.AES.encrypt(
      JSON.stringify(rooms),
      secretKey
    ).toString();
    res.status(201).json({ publicKey, ciphertext });
  } else {
    res.status(201).json(rooms);
  }
});

// @desc Get Channel rooms
// @route GET /api/v1/rooms/channels/
// @access Public
exports.getChannels = asyncHandler(async (req, res, next) => {
  const rooms = await Room.find({
    type: "Channel",
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
exports.uploadFile = async (req, res, next) => {
  res.status(201).json(`http://${req.get("host")}/upload/${req.file.filename}`);
};
exports.createRoom = asyncHandler(async (req, res, next) => {
  if (req.file) {
    req.body.photo = `http://${req.get("host")}/upload/${req.file.filename}`;
  }

  if (req.body.type === "Channel" || req.body.type === "Group") {
    if (req.body.type === "Group")
      req.body = {
        ...req.body,
        users: [...req.body.to.split(","), req.params.userId],
      };
    else
      req.body = {
        ...req.body,
        users: [req.params.userId],
      };
    room = await Room.create(req.body);
    room = await room.populate("users").execPopulate();
  } else {
    const to = await User.findOne({ phoneNumber: req.body.to });
    req.body = {
      ...req.body,
      users: [to._id, req.params.userId],
    };

    const checkRoom = await Room.findOne({
      type: "Private",
      users: { $all: req.body.users },
    });
    if (checkRoom) {
      checkRoom.users = req.body.users;
      room = checkRoom;
    } else {
      room = await Room.create(req.body);
      room = await room.populate("users").execPopulate();
    }
  }
  res.status(201).json(room);
});

// @desc update room
// @route put /api/v1/rooms/roomId
// @access Private
exports.updateGroup = asyncHandler(async (req, res, next) => {
  if (req.file) {
    req.body.photo = `http://${req.get("host")}/upload/${req.file.filename}`;
  }
  let room = await Room.findByIdAndUpdate({ _id: req.params.roomId }, req.body);
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
exports.deleteMessage = asyncHandler(async (req, res, next) => {
  await Message.findByIdAndUpdate(req.params.messageId, {
    $push: { deleted: req.params.userId },
  });
  res.status(201).json("success");
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
