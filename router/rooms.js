const express = require("express");
const upload = require("../middleware/multer");

const {
  getUserRooms,
  getRoom,
  createRoom,
  deleteRoom,
  addUserToGroup,
  removeUserFromGroup,
  updateGroup,
  getChannels,
  deleteMessage,
} = require("../controllers/rooms");
const router = express.Router();
router.route("/user/:userId").post(upload.single("photo"), createRoom);

router.route("/:roomId/add").post(addUserToGroup);
router.route("/:roomId/remove").post(removeUserFromGroup);

router.route("/user/:userId").get(getUserRooms);
router.route("/user/:userId/delete/:messageId").get(deleteMessage);

router.route("/channels/").get(getChannels);

router
  .route("/:roomId")
  .get(getRoom)
  .delete(deleteRoom)
  .put(upload.single("photo"), updateGroup);

module.exports = router;
