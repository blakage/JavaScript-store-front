const express = require('express');
const mysql = require('mysql');
const path = require('path');

// Express Setup:
const app = express();
app.get("/", (req, res) => { 
    const filePath = path.resolve('../', "index.html");
    res.sendFile(filePath);
})
// Serve static files:
app.use(express.static('../'));

// MySQL Connection (assumes success)
const connection = mysql.createConnection({
    host: "localhost",
    database: "store",
    user: "root",
    password: '',
})

app.listen(8080, () => {})