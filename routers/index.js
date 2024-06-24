const express = require('express');
const router = express.Router();
const user_ctrl = require('../controllers/user.ctrl');
const chat_ctrl = require('../controllers/chat.ctrl');
const authenticateToken = require('../middlewares/auth');

//user 관련
router.post('/user/userCreate', user_ctrl.userCreate);
router.post('/user/userLogin', user_ctrl.userLogin);
router.post('/user/userSearch', user_ctrl.userSearch);
router.post('/user/addFriend', user_ctrl.addFriend);

//chat 관련
router.post('/chat/chatCreate', chat_ctrl.chatCreate);

module.exports = router;