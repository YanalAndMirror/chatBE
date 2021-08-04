const Session = require("../models/Session");
const Message = require("../models/Message");
const Room = require("../models/Room");

const RoomSeen = async ({ roomId, userId }) => {
  let thisRoom = await Room.findOne({ _id: roomId });

  let usersSessions = await Session.find({ user: thisRoom.users });
  usersSessions = usersSessions.map((usersSession) => usersSession.socket);

  const thisTime = new Date();

  await Message.updateMany(
    { "receivers._id": userId, room: roomId, "receivers.seen": null },
    {
      $set: {
        "receivers.$.seen": thisTime.getTime(),
      },
    }
  );

  io.to(usersSessions).emit("roomSeen", {
    userId,
    roomId,
    time: thisTime.toISOString(),
  });
};

module.exports = RoomSeen;
