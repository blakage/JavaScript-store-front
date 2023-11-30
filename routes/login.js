const bcrypt = require("bcrypt");
const connection = require('../connection');
const sanitizer = require("sanitize")();
const { randomBytes } = require('crypto');

module.exports = function (app) {
    app.post('/login', function (request, response) {
        var { username, password, confirm_password } = request.body;
        username = sanitizer.value(username, 'str');
        password = sanitizer.value(password, 'str');

        // Starting query:
        var query = connection.query("SELECT * FROM Accounts WHERE username = " + connection.escape(username), function(error, result) {
            if (result.length > 0 ) {
                // Caught onto user, check password:
                var pass_check = bcrypt.compareSync(password, result[0].password);
                if (pass_check) {
                     // Correct password! Generate sessionId
                    const sessionId = randomBytes(16).toString("base64");
                    response.cookie("sessionId", sessionId);
                    const sessionMap = app.get("sessionMap")
                    sessionMap[sessionId] = username;
                    return response.render("account", {
                        message: "You\'re successfully logged in!"
                    })
                } else {
                    return response.render("login", {
                        message: "The username or password you provided is incorrect.",
                        message_style: "danger",
                    });
                }

            } else {
                // No user exists with the provided username:
                return response.render("login", {
                    message: "The username or password you provided is incorrect.",
                    message_style: "danger",
                });
            }
        });
    });

    app.get('/login', function (request, response) {
        return response.render("login", { message : null });
    });

    // Logout:
    app.get("/logout", (request, response) => {
        const sessionId = request.cookies.sessionId;
        const sessionMap = app.get("sessionMap");
        delete sessionMap[sessionId];
        response.clearCookie('sessionId');
        response.redirect('/');
    })
}