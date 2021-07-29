const Session = require("../models/Session");
const Message = require("../models/Message");
const Room = require("../models/Room");

const MessageUpdate = async ({ messageId, content }) => {
  let newMessage = await Message.findOneAndUpdate(
    { _id: messageId },
    { content },
    { new: true }
  ).populate("user");
  let thisRoom = await Room.findOne({ _id: newMessage.room });
  let usersSessions = await Session.find({ user: thisRoom.users });
  usersSessions = usersSessions.map((usersSession) => usersSession.socket);
  io.to(usersSessions).emit("messageUpdate", {
    roomId: thisRoom._id,
    newMessage,
  });
};
module.exports = MessageUpdate;
