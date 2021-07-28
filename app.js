const express = require("express");
const app = express();
const path = require("path");

//const morgan = require("morgan");
const cors = require("cors");
const errorHandler = require("./middleware/error");
const http = require("http");
app.use(cors());

const server = http.createServer(app);
const socketio = require("socket.io");
io = socketio(server, {
  cors: {
    origin: "*",
  },
});
const Session = require("./models/Session");
const Room = require("./models/Room");
const Message = require("./models/Message");
const User = require("./models/User");

Session.deleteMany({ user: { $exists: true, $ne: null } }).then((a) => {});
io.on("connection", (socket) => {
  socket.on("userId", (userId) => {
    Session.create({ user: userId, socket: socket.id });
  });

  socket.on("disconnect", async () => {
    await Session.deleteOne({ socket: socket.id });
  });
  socket.on("chatMessage", async ({ userId, roomId, content }) => {
    let thisRoom = await Room.findOne({ _id: roomId });
    let thisUser = await User.findById(userId);
    if (thisRoom) {
      let thisMessage = await Message.create({
        content,
        room: roomId,
        user: userId,
      });
      thisMessage.user = thisUser;
      let usersSessions = await Session.find({ user: thisRoom.users });
      usersSessions = usersSessions.map((usersSession) => usersSession.socket);
      if (usersSessions.length > 0) {
        io.to(usersSessions).emit("message", {
          userId,
          roomId,
          content: thisMessage,
        });
      }
    }
  });
});
// Route files
const users = require("./router/users");
const rooms = require("./router/rooms");

const connectDb = require("./db");
connectDb();
app.use(express.json());
app.use("/upload", express.static(path.join(__dirname, "upload")));

//app.use(morgan("dev"));
app.use("/api/v1/users", users);
app.use("/api/v1/rooms", rooms);
app.use(errorHandler);

server.listen("8000", console.log(`server running in 8000`));
// error mw
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error ${err.message}`);
});
