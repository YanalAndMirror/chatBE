const express = require('express');
const upload = require('../middleware/multer');

const {
  getUsers,
  getUser,
  createUser,
  loginUser,
  updateUser,
  deleteUser,
} = require('../controllers/users');
const router = express.Router();
router.route('/').get(getUsers).post(createUser);
router.route('/login').post(loginUser);
router
  .route('/:id')
  .get(getUser)
  .put(upload.single('photo'), updateUser)
  .delete(deleteUser);

module.exports = router;
