const Session = require("../models/Session");
const Room = require("../models/Room");

const StartSession =
  (socket) =>
  async ({ userId }) => {
    Session.create({ user: userId, socket: socket.id });
    let thisRooms = await Room.find({
      users: userId,
    });
    let thisUsers = thisRooms
      .map((room) => room.users)
      .join(",")
      .split(",");

    let usersSessions = await Session.find({ user: { $in: thisUsers } });
    usersSessions = usersSessions.map((usersSession) => usersSession.socket);
    io.to(usersSessions).emit("messageRead", {
      userId,
      roomIds: thisRooms.map((room) => room._id),
      time: new Date().toISOString(),
    });
  };
module.exports = StartSession;
