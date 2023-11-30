const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const bodyParser = require('body-parser');

// Cookie Parser setup:
app.use(cookieParser(process.env.COOKIE_PARSER_SECRET));

// User Management:
SESSION_MAP = {};
app.set("sessionMap", SESSION_MAP);

// Serve static files:
app.use(express.static('.'));

// Session Middleware:
app.use(session({
    secret: 'cart-session',
    resave: false,
    saveUninitialized: true
}));

// Allows for request.body.{...}
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Utilize a template engine:
app.set('view engine', 'ejs');

const cartRoutes = require('./routes/cart.js');

// Use the cartRoutes for the /cart route
cartRoutes(app);


// EJS Template "Globals":
userManager = require("./userManager.js");
app.use(function (req, res, next) {
    const sessionId = req.cookies.sessionId;
    if (sessionId) {
        res.locals.isAuthenticated = userManager.getUsernameFromSessionID(sessionId, SESSION_MAP);
    } else {
        res.locals.isAuthenticated = null; // or handle the case when sessionId is undefined/null
    }
    next();
});

// Import the dice route handler
console.log('Loading dice routes...');
const diceRouter = require('./routes/dice.js');

// Use the diceRouter for the /dice route
app.use('/dice', diceRouter);

// Routes
var rPath = "./routes/";
fs.readdirSync(rPath).forEach(function (file) {
    var route = path.join(__dirname, 'routes', file);
    try {
        var routeHandler = require(route);
        if (typeof routeHandler === 'function') {
            routeHandler(app);
            console.log(`Successfully loaded route handler for ${route}`);
        } else {
            console.error(`Error: ${route} does not export a function as expected.`);
        }
    } catch (error) {
        console.error(`Error loading route handler for ${route}: ${error.message}`);
    }
});

// Listen on Port 8080.
app.listen(8080, () => {
    console.log("Available at http://localhost:8080");
});