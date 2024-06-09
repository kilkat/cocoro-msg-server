const Sequelize = require('sequelize');

module.exports = class Friends extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            userId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id'
                }
            },
            friendId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id'
                }
            }
        }, {
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: 'Friends',
            tableName: 'friends',
            paranoid: true,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }

    static associate(db) {
        this.belongsTo(db.User, { foreignKey: 'userId', as: 'User' });
        this.belongsTo(db.User, { foreignKey: 'friendId', as: 'Friend' });
    }
}
