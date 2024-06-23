const express = require('express');
const router = express.Router();
const controller = require('../controllers');
const authenticateToken = require('../middlewares/auth');

router.get('/', controller.getTest);

//user 관련
router.post('/user/userCreate', controller.userCreate);
router.post('/user/userLogin', controller.userLogin);
router.post('/user/userSearch', controller.userSearch);
router.post('/user/addFriend', controller.addFriend);

//chat 관련
router.post('/chat/chatCreate', controller.chatCreate);

module.exports = router;