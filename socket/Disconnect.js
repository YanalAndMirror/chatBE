const Session = require("../models/Session");
const Disconnect = (socket) => async () => {
  console.log(socket.id);
  await Session.deleteOne({ socket: socket.id });
};
module.exports = Disconnect;
