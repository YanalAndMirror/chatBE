const Session = require("../models/Session");
const Room = require("../models/Room");

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

    socket.on("call", async ({ userId, sender }) => {
      let thisUser = await Session.find({ user: userId });
      socket.to(thisUser.map((a) => a.socket)).emit("call", { sender });
    });
    socket.on("callAccept", async ({ userId }) => {
      console.log(userId);
      let thisUser = await Session.find({ user: userId });
      console.log(thisUser);
      socket.to(thisUser.map((a) => a.socket)).emit("callAccept", "calling");
    });
    socket.on("peer", Peer(socket));
    socket.on("peerRecive", PeerRecive(socket));

    socket.on("endCall", async ({ roomId }) => {
      let thisRoom = await Room.findOne({ _id: roomId });
      let usersSessions = await Session.find({ user: thisRoom.users });
      socket.to(usersSessions.map((a) => a.socket)).emit("peerEnd", "calling");
    });
  });
};
module.exports = SocketIo;
