const express = require('express');
const router = express.Router();
const controller = require('../controllers/index.ctrl');
const authenticateToken = require('../middlewares/auth');

router.get('/', controller.getTest);
router.post('/user/userCreate', controller.userCreate);
router.post('/user/userLogin', controller.userLogin);
router.post('/user/userFriends', authenticateToken, controller.userFriends);

module.exports = router;