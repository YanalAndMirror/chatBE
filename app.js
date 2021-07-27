const express = require("express");
const app = express();
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
  console.log("New WS Connection");
});
// Route files
const users = require("./router/users");

const connectDb = require("./db");
connectDb();
app.use(express.json());

//app.use(morgan("dev"));
app.use("/api/v1/users", users);
app.use(errorHandler);

server.listen("8000", console.log(`server running in 8000`));
// error mw
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error ${err.message}`);
});
