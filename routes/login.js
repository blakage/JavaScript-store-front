const bcrypt = require("bcrypt");
const sanitizer = require("sanitize")();
const sequelize = require('../sequelize_conn');
const User = require("../models/User.model");

module.exports = function (app) {
    app.post('/login', async function (request, response) {
        var { username, password } = request.body;
        username = sanitizer.value(username, 'str');
        password = sanitizer.value(password, 'str');

        // Starting query:
        const result = await User.findOne({where: {username: username}})

        // User does not exist:
        if (result == null) {
            return response.render("login", {
                message: "The username or password you provided is incorrect.",
                message_style: "danger",
            });
        }

        // Check password:
        const pass_check = bcrypt.compareSync(password, result.password);
        if (pass_check) {
            // Correct password! Generate sessionId
            session = request.session;
            session.username = username;
            session.isAdmin = result.isAdmin;
            session.user = [username, result.isAdmin, result.image];
            session.message = true;
            return response.redirect("account")
        } else {
            return response.render("login", {
                message: "The username or password you provided is incorrect.",
                message_style: "danger",
            });
        }
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