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
                     session = request.session;
                     session.username = username;
                     session.user = [username, result[0].isAdmin];
                    return response.redirect("account")
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
        // Shoot towards account page if already logged in:
        const username = request.session.username;
        console.log(username);
        if (username != null) {
            return response.render("account", {});
        }
        return response.render("login", { message : null });
    });

    // Logout:
    app.get("/logout", (request, response) => {
        request.session.destroy();
        response.redirect('/');
    })
}