const Room = require("../models/Room");
const Message = require("../models/Message");
const User = require("../models/User");
const Session = require("../models/Session");

const ChatMessages = async ({ userId, roomId, content }) => {
  let thisRoom = await Room.findOne({ _id: roomId });
  let thisUser = await User.findById(userId);
  if (thisRoom) {
    let usersSessions = await Session.find({ user: thisRoom.users });
    let OnlineUsers = usersSessions.map((usersSession) => usersSession.user);
    let thisMessage = await Message.create({
      content,
      room: roomId,
      user: userId,
      receivers: thisRoom.users
        .filter((user) => userId != user._id)
        .map((user) => {
          return {
            _id: user._id,
            received: OnlineUsers.includes(user._id.toString())
              ? Date.now()
              : null,
            seen: null,
          };
        }),
    });
    thisMessage.user = thisUser;
    usersSessions = usersSessions.map((usersSession) => usersSession.socket);
    let OfflineUsers = thisRoom.users.filter(
      (user) => !OnlineUsers.includes(user._id.toString())
    );
    OfflineUsers.forEach((user) => {
      //send Notifcation
    });
    if (usersSessions.length > 0) {
      io.to(usersSessions).emit("message", {
        userId,
        roomId,
        content: thisMessage,
      });
    }
  }
};
module.exports = ChatMessages;
