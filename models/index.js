const Sequelize = require('sequelize');
const User = require('./users');
const Friends = require('./friends');
const ChatRoom = require('./chatrooms');
const Message = require('./messages');
const ChatRoomMembers = require('./chatroomsmembers');

const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = User;
db.Friends = Friends;
db.ChatRoom = ChatRoom;
db.Message = Message;
db.ChatRoomMembers = ChatRoomMembers;

User.init(sequelize);
Friends.init(sequelize);
ChatRoom.init(sequelize);
Message.init(sequelize);
ChatRoomMembers.init(sequelize);

User.associate(db);
Friends.associate(db);
ChatRoom.associate(db);
Message.associate(db);

module.exports = db;