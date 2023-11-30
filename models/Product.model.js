const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize_conn');

const ProductTypes = {
    DICE: "dice",
    ACESSORY: "accessory",
}

const Product = sequelize.define("products", {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    category: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
})
sequelize.sync()

module.exports = Product;