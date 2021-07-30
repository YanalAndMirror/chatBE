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
    socket.on("messageUpdate", MessageUpdate);
    socket.on("peer", async ({ data, userId }) => {
      let thisUser = await Session.find({ user: userId });
      console.log("peer" + thisUser);
      socket.to(thisUser.map((a) => a.socket)).emit("startPeer", { data });
    });
    socket.on("peerRecive", async ({ data, userId }) => {
      let thisUser = await Session.find({ user: userId });
      console.log("peerRecive" + thisUser);
      socket.to(thisUser.map((a) => a.socket)).emit("reciverPeer", { data });
    });
  });
};
module.exports = SocketIo;
