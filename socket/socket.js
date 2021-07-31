const Session = require("../models/Session");
const ChatMessages = require("./ChatMessage");
const Disconnect = require("./Disconnect");
const MessageUpdate = require("./MessageUpdate");
const Peer = require("./peer");
const PeerRecive = require("./peerRecive");
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
    socket.on("messageUpdate", MessageUpdate);
    socket.on("peer", Peer(socket));
    socket.on("peerRecive", PeerRecive(socket));
  });
};
module.exports = SocketIo;
