const Session = require("../models/Session");
const Room = require("../models/Room");
const nodeCrypto = require("create-ecdh");
const StartSession =
  (socket) =>
  async ({ userId, clientPublicKey }) => {
    let thisRooms = await Room.find({
      users: userId,
    });
    let thisUsers = thisRooms
      .map((room) => room.users)
      .join(",")
      .split(",");
    let secretKey;
    let serverPublicKey;
    if (clientPublicKey) {
      let server = nodeCrypto("secp256k1");
      server.generateKeys();
      serverPublicKey = server.getPublicKey(null, "compressed");
      secretKey = server
        .computeSecret(Buffer.from(clientPublicKey))
        .toString("hex");
    } else {
      secretKey = null;
    }
    Session.create({ user: userId, socket: socket.id, secretKey });
    if (clientPublicKey) io.to(socket.id).emit("handshak", { serverPublicKey });
    let usersSessions = await Session.find({ user: { $in: thisUsers } });
    usersSessions = usersSessions.map((usersSession) => usersSession.socket);
    io.to(usersSessions).emit("messageRead", {
      userId,
      roomIds: thisRooms.map((room) => room._id),
      time: new Date().toISOString(),
    });
  };
module.exports = StartSession;
