const express = require("express");
const path = require("path");
const cors = require("cors");

// Error handeling

const errorHandler = require("./middleware/error");

// Route files
const users = require("./router/users");
const rooms = require("./router/rooms");

// SocketIo
const SocketIo = require("./socket/socket");
const socketio = require("socket.io");
const http = require("http");

// Mongo Db
const connectDb = require("./db");

const app = express();
app.use(cors());
const server = http.createServer(app);

io = socketio(server, {
  cors: {
    origin: "*",
  },
});
SocketIo();
connectDb();
app.use(express.json());
app.use("/upload", express.static(path.join(__dirname, "upload")));

//app.use(morgan("dev"));
app.use("/api/v1/users", users);
app.use("/api/v1/rooms", rooms);
app.use(errorHandler);

server.listen("8080", console.log(`server running in 8080`));
// error mw
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error ${err.message}`);
});
