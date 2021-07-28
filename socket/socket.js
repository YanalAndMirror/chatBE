const Session = require("../models/Session");
const ChatMessages = require("./ChatMessage");
const Disconnect = require("./Disconnect");
const RoomSeen = require("./RoomSeen");

const SocketIo = () => {
  // Clear sessions
  Session.deleteMany({ user: { $exists: true, $ne: null } }).then((a) => {});
  io.on("connection", (socket) => {
    socket.on("userId", (userId) => {
      Session.create({ user: userId, socket: socket.id });
    });
    socket.on("disconnect", Disconnect(socket));
    socket.on("chatMessage", ChatMessages);
    socket.on("roomSeen", RoomSeen);
  });
};
module.exports = SocketIo;
