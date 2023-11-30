const bcrypt = require("bcrypt");
const sanitizer = require("sanitize")();
const sequelize = require('../sequelize_conn');
const User = require("../models/User.model");

module.exports = function (app) {
    app.post('/create', async (request, response) => {
        var { username, password, confirm_password } = request.body;
        username = sanitizer.value(username, 'str');
        password = sanitizer.value(password, 'str');
        confirm_password = sanitizer.value(confirm_password, 'str');

        // Check if provided passwords match:
        if (password != confirm_password) {
            return response.render("create", {
                message: "Provided passwords do not match."
            });
        }

        // Check if username is already registered:
        const result = await User.findOne({where: {username: username}})

        // Username already exists:
        if (result != null) {
            return response.render("create", {
                message: "Username '" + username + "' is already registered."
            });
        }

        // Hash password:
        const hashed_password = bcrypt.hashSync(password, 13);

        // Insert:
        await User.create({
            username : username,
            password: hashed_password,
        })

        return response.render("login", { 
            message: "Successfully created account!",
            message_style: "success",
        })
    });

    app.get('/create', function (request, response) {
        // Shoot towards account page if already logged in:
        const username = request.session.username;
        if (username != null) {
            return response.render("account", {});
        }
        response.render("create", { message: null });
    });
}