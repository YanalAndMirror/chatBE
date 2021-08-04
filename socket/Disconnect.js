const Session = require("../models/Session");

const Disconnect = (socket) => async () => {
  await Session.deleteOne({ socket: socket.id });
};

module.exports = Disconnect;
