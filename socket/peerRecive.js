const Session = require("../models/Session");
const PeerRecive =
  (socket) =>
  async ({ data, userId }) => {
    let thisUser = await Session.find({ user: userId });
    socket.to(thisUser.map((a) => a.socket)).emit("reciverPeer", { data });
  };
module.exports = PeerRecive;
