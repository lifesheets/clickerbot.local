module.exports = (sequelize, DataTypes) => {
    const model = sequelize.define("accounts", {
        id: {
            type: DataTypes.INTEGER(11),
            primaryKey: true,
            autoIncrement: true
        },
        telegramId: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        username: {
            type: DataTypes.STRING,
            allowNull: true
        }
    });
    return model;
};