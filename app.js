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

io.on("connection", (socket) => {
  console.log(socket.id);
  socket.on("userId", (userId) => {
    Session.create({ user: userId, socket: socket.id });
  });

  socket.on("disconnect", async () => {
    console.log(socket.id + " Bye");
    await Session.deleteOne({ socket: socket.id });
  });
  socket.on("chatMessage", async ({ userId, roomId, content }) => {
    console.log(userId);
    let thisRoom = await Room.findOne({ _id: roomId });
    let usersSessions = await Session.find({ user: thisRoom.users });
    console.log(thisRoom.users);
    usersSessions = usersSessions.map((usersSession) => usersSession.socket);
    if (usersSessions.length > 0) {
      console.log(usersSessions);
      io.to(usersSessions).emit("message", { userId, roomId, content });
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
