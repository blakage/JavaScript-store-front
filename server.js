const body_parser = require('body-parser'); 
const express = require('express');
const path = require('path');
const fs = require("fs");
const cookieParser = require('cookie-parser');
const sessions = require("express-session");

// Express Setup:
const app = express();

// Cookie Parser setup:
app.use(cookieParser(process.env.COOKIE_PARSER_SECRET));

// Session setup:
app.use(sessions({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: true,
    cookie: { maxAge: 86400000 },
    resave: false
}));


// MySQL Connection
require("./connection.js");

// Serve static files:
app.use(express.static('.'));

// Allows for request.body.{...}
app.use(body_parser.urlencoded({ extended: false }));
app.use(body_parser.json());

// Utilize a template engine:
app.set('view engine', 'ejs');

// EJS Template "Globals":
app.use(function (req, res, next) {
    console.log(req.session.user);
    res.locals.user = req.session.user;
    next();
});

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
global.app = app;