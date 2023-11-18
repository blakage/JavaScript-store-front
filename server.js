const body_parser = require('body-parser'); 
const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const fs = require("fs");

// Express Setup:
const app = express();
app.get("/", (req, res) => { 
    const filePath = path.resolve('', "index.html");
    res.sendFile(filePath);
})

// MySQL Connection
require("dotenv").config();
const connection = mysql.createConnection({
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


// Serve static files:
app.use(express.static('.'));

// Allows for request.body.{...}
app.use(body_parser.urlencoded({ extended: false }));
app.use(body_parser.json());

// Utilize a template engine:
app.set('view engine', 'ejs');

// Routes
var routes = require('./routes/register');
routes(app);

// Listen on Port 8080.
app.listen(8080, () => {})