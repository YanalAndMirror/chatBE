const Session = require("../models/Session");
const ChatMessages = require("./ChatMessage");
const Disconnect = require("./Disconnect");
const MessageUpdate = require("./MessageUpdate");
const RoomSeen = require("./RoomSeen");
const StartSession = require("./startSession");

const SocketIo = () => {
  // Clear sessions
  Session.deleteMany({ user: { $exists: true, $ne: null } }).then((a) => {});
  io.on("connection", (socket) => {
    socket.on("startSession", StartSession(socket));
    socket.on("disconnect", Disconnect(socket));
    socket.on("chatMessage", ChatMessages);
    socket.on("roomSeen", RoomSeen);
    // Delete for all / Edit
    socket.on("messageUpdate", MessageUpdate);

    //
  });
};
module.exports = SocketIo;
