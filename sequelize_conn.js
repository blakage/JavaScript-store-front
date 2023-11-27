const { Sequelize } = require('sequelize');

var sequelize = new Sequelize(
    "store",
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: "127.0.0.1",
        dialect: "mysql",
    }
)
sequelize.authenticate()
module.exports = sequelize;