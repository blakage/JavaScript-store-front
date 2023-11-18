const express = require('express');
const mysql = require('mysql2');
const path = require('path');

// Express Setup:
const app = express();
app.get("/", (req, res) => { 
    const filePath = path.resolve('../', "index.html");
    res.sendFile(filePath);
})
// Serve static files:
app.use(express.static('../'));

// MySQL Connection
const connection = mysql.createConnection({
    host: "localhost",
    database: "store",
    user: "root",
    password: 'dev1',
})
connection.connect((error) => {
    if (error) {
        console.log(error);
        return;
    }
    console.log("Connected Successfully to MySQL server on port 3306.")
})

app.listen(8080, () => {})