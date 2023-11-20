const body_parser = require('body-parser'); 
const express = require('express');
const path = require('path');
const fs = require("fs");

// Express Setup:
const app = express();
app.get("/", (req, res) => { 
    const filePath = path.resolve('', "index.html");
    res.sendFile(filePath);
})

// MySQL Connection
require("./connection.js");

// Serve static files:
app.use(express.static('.'));

// Allows for request.body.{...}
app.use(body_parser.urlencoded({ extended: false }));
app.use(body_parser.json());

// Utilize a template engine:
app.set('view engine', 'ejs');

// Routes
var rPath = "./routes/"
fs.readdirSync(rPath).forEach(function(file) {
    var route = rPath+file;
    require(route)(app);
})

// Listen on Port 8080.
app.listen(8080, () => {
    console.log("Available at http://localhost:8080")
})