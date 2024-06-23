const Sequelize = require('sequelize');

module.exports = class Message extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            message: {
                type: Sequelize.TEXT,
                allowNull: false,
            },
            sentAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW,
            },
        }, {
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: 'Message',
            tableName: 'messages',
            paranoid: true,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }

    static associate(db) {
        this.belongsTo(db.User, {
            foreignKey: 'userId',
            as: 'Sender',
        });
        this.belongsTo(db.ChatRoom, {
            foreignKey: 'chatroomId',
            as: 'ChatRoom',
        });
    }
};
