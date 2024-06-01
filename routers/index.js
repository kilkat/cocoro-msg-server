const express = require('express');
const router = express.Router();
const controller = require('../controllers/index.ctrl.js');

router.get('/', controller.getTest);
router.post('/userCreate', controller.userCreate);
router.post('/userLogin', controller.userLogin);

module.exports = router;