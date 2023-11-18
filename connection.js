const mysql = require('mysql2');
require("dotenv").config();

var connection = mysql.createConnection({
    host: "localhost",
    database: "store",
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
})
connection.connect((error) => {
    if (error) {
        console.log(error);
        return;
    }
    console.log("Connected Successfully to MySQL server on port 3306.")
})
module.exports = connection;
