const Sequelize = require('sequelize');

module.exports = class ChatRoomMembers extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            chatroomId: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'ChatRooms',
                    key: 'id',
                },
                onDelete: 'CASCADE',
            },
            userId: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'Users',
                    key: 'id',
                },
                onDelete: 'CASCADE',
            },
        }, {
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: 'ChatRoomMembers',
            tableName: 'chatroommembers',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }
};
