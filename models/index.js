const Sequelize = require('sequelize');
const User = require('./users');
const Friends = require('./friends');

const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = User;
db.Friends = Friends;

User.init(sequelize);
Friends.init(sequelize);

User.associate(db);
Friends.associate(db);

module.exports = db;