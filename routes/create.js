const bcrypt = require("bcrypt");
const connection = require('../connection');
const sanitizer = require("sanitize")();

module.exports = function (app) {
    app.post('/create', (request, response) => {
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
        var retval = connection.query("SELECT * FROM Accounts WHERE username = " + connection.escape(username));
        if (retval[0] != null) {
            return response.render("create", {
                message: "Username '" + username + "' is already registered."
            });
        }

        const hashed_password = bcrypt.hashSync(password, 13);

        // Insert into DB:
        connection.query("INSERT INTO Accounts SET?", {
            username: username,
            password: hashed_password
        }, (error, response) => {
            console.log(error);
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