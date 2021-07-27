const express = require('express');

const {
  getUserRooms,
  getRoom,
  createRoom,
  deleteRoom,
} = require('../controllers/rooms');
const router = express.Router();
router.route('/user/:userId').post(createRoom);
router.route('/user/:userId').get(getUserRooms);
router.route('/:roomId').get(getRoom).delete(deleteRoom);

module.exports = router;
