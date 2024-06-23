const { ChatRoom, ChatRoomMembers, Message } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {Op} = require('sequelize');
require('dotenv').config();

module.exports.chatCreate = (req, res, next) => {
    
}