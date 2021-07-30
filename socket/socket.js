const Session = require('../models/Session');
const ChatMessages = require('./ChatMessage');
const Disconnect = require('./Disconnect');
const MessageUpdate = require('./MessageUpdate');
const RoomSeen = require('./RoomSeen');
const StartSession = require('./startSession');

const SocketIo = () => {
  // Clear sessions
  Session.deleteMany({ user: { $exists: true, $ne: null } }).then((a) => {});
  io.on('connection', (socket) => {
    socket.on('startSession', StartSession(socket));
    socket.on('disconnect', Disconnect(socket));
    socket.on('chatMessage', ChatMessages);
    socket.on('roomSeen', RoomSeen);
    // yanal trying
    socket.emit('me', socket.id);
    socket.on('end', () => {
      socket.broadcast.emit('callEnded');
    });
    socket.on('callUser', (data) => {
      io.to(data.userToCall).emit('callUser', {
        signal: data.signalData,
        from: data.from,
        name: data.name,
      });
    });
    socket.on('answerCall', (data) => {
      io.to(data.to).emit('callAccepted', data.signal);
    });
    //
    // Delete for all / Edit
    socket.on('messageUpdate', MessageUpdate);

    //
  });
};
module.exports = SocketIo;
