const Sequelize = require('sequelize');

module.exports = class ChatRoom extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            name: {
                type: Sequelize.STRING(100),
                allowNull: false,
            },
        }, {
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: 'ChatRoom',
            tableName: 'chatrooms',
            paranoid: true,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }

    static associate(db) {
        this.belongsToMany(db.User, {
            through: db.ChatRoomMembers, // 중간 테이블을 지정
            as: 'Members',
            foreignKey: 'chatroomId',
            otherKey: 'userId',
        });
        this.hasMany(db.Message, {
            foreignKey: 'chatroomId',
            as: 'Messages',
        });
    }
};
