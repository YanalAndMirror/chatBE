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

io.on("connection", (socket) => {
  socket.on("chatMessage", ({ roomId, content }) => {
    console.log({ roomId, content });
    io.emit("message", { roomId, content });
  });
});
// Route files
const users = require("./router/users");

const connectDb = require("./db");
connectDb();
app.use(express.json());
app.use("/upload", express.static(path.join(__dirname, "upload")));

//app.use(morgan("dev"));
app.use("/api/v1/users", users);
app.use(errorHandler);

server.listen("8000", console.log(`server running in 8000`));
// error mw
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error ${err.message}`);
});
