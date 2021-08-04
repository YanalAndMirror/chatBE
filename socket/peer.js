const Session = require("../models/Session");

const Peer =
  (socket) =>
  async ({ data, userId }) => {
    let thisUser = await Session.find({ user: userId });
    socket.to(thisUser.map((a) => a.socket)).emit("startPeer", { data });
  };

module.exports = Peer;
