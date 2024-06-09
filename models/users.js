const Sequelize = require('sequelize');

module.exports = class User extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            email: {
                type: Sequelize.STRING(50),
                allowNull: false,
                unique: true,
            },
            name: {
                type: Sequelize.STRING(20),
                allowNull: false,
                unique: false,
            },
            phone: {
                type: Sequelize.STRING(15),
                allowNull: false,
                unique: true,
            },
            password: {
                type: Sequelize.STRING(250),
                allowNull: false,
                unique: false,
            },
        }, {
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: 'User',
            tableName: 'users',
            paranoid: true,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }

    static associate(db) {
        this.belongsToMany(db.User, {
            through: db.Friends,
            as: 'FriendsList',
            foreignKey: 'userId',
            otherKey: 'friendId'
        });
        this.belongsToMany(db.User, {
            through: db.Friends,
            as: 'UserFriendList',
            foreignKey: 'friendId',
            otherKey: 'userId'
        });
    }
}
