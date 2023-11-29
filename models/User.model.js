const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize_conn');

const User = sequelize.define("Users", {
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    isAdmin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
    },
    image: {
        type: DataTypes.STRING,
        allowNull: true,
    }
})
sequelize.sync()

module.exports = User;