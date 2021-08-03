const Room = require("../models/Room");
const Message = require("../models/Message");
const User = require("../models/User");
const Session = require("../models/Session");
const CryptoJS = require("crypto-js");

const ChatMessages =
  (socket) =>
  async ({ userId, roomId, content }) => {
    let thisUserSession = await Session.findOne({ socket: socket.id });
    if (!thisUserSession) return;
    if (thisUserSession.secretKey) {
      console.log(content);
      content = JSON.parse(
        CryptoJS.AES.decrypt(content, thisUserSession.secretKey).toString(
          CryptoJS.enc.Utf8
        )
      );
      console.log(content);
    }
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
      //usersSessions = usersSessions.map((usersSession) => usersSession.socket);

      let OfflineUsers = thisRoom.users.filter(
        (user) => !OnlineUsers.includes(user._id.toString())
      );
      OfflineUsers.forEach((user) => {
        //send Notifcation
      });
      if (usersSessions.length > 0) {
        usersSessions.forEach((userSession) => {
          let cypherText;
          if (userSession.secretKey)
            cypherText = CryptoJS.AES.encrypt(
              JSON.stringify(thisMessage),
              userSession.secretKey
            ).toString();
          else {
            cypherText = thisMessage;
          }
          io.to(userSession.socket).emit("message", {
            userId,
            roomId,
            content: cypherText,
          });
        });
      }
    }
  };
module.exports = ChatMessages;
