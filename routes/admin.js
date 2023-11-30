const connection = require('../connection');
const sanitizer = require("sanitize")();

function getTable(callback) {
    var query = connection.query("SELECT * FROM Users", function (error, result) {
        if (error) {
            callback(error, []);
        } else {
            callback(null, result)
        }
    });
}

module.exports = function (app) {
    app.get('/admin', function (request, response) {
        // Only allow access if authenticated and isAdmin is set:
        const username = request.session.username;
        const isAdmin = request.session.isAdmin;
        if (username == null || isAdmin < 1) {
            // Not logged in.
            return response.render("login", {
                message: "You do not have access to perform that action.",
                message_style: "danger",
            });
        }
        // Starting query:
        getTable(function(error, result) {
            response.render("admin", {"table": result, "message": null});
        })
    });

    app.post("/admin", function(request, response) {
        var { username, action } = request.body;
        username = sanitizer.value(username, 'str');
        action = sanitizer.value(action, 'str');

        // Query from username to begin with:
        var query = connection.query("SELECT * FROM Users WHERE username = " + connection.escape(username), function (error, result) {
            if (result.length > 0) {
                // User is result[0], check action:
                if (action === "action_admin") {
                    // Only be allowed to do this on users who are not us.
                    if (result[0].username === request.session.username) {
                        getTable(function (error, result) {
                            return response.render("admin", {
                                "table": result,
                                "message": "Sorry. You cannot toggle admin status on yourself.",
                                "message_style": "danger",
                            });
                        })
                    }
                    // Toggle admin:
                    connection.query("UPDATE Users SET isAdmin=" + connection.escape(!result[0].isAdmin) + " WHERE username=" + connection.escape(username),
                    (error, response) => { console.log(error); })
                    getTable(function (error, result) {
                        return response.render("admin", {
                            "table": result,
                            "message": "Sucessfully updated the administrative status of user: " + username,
                            "message_style": "success",
                        });
                    })
                }
                if (action === "action_delete") {
                    // User cannot delete other admins.
                    if (result[0].isAdmin > 0) {
                        getTable(function (error, result) {
                            return response.render("admin", {
                                "table": result,
                                "message": "Sorry. You cannot delete the record of another administrative user.",
                                "message_style": "danger",
                            });
                        });
                    }
                    // or themselves...
                    if (result[0].username === request.session.username) {
                        getTable(function (error, result) {
                            return response.render("admin", {
                                "table": result,
                                "message": "Sorry. You cannot delete your own record.",
                                "message_style": "danger",
                            });
                        });
                    }
                    // Delete:
                    connection.query("DELETE FROM Users WHERE username=" + connection.escape(username),
                        (error, response) => { console.log(error); })
                        getTable(function(error, result) {
                            return response.render("admin", {
                                "table": result,
                                "message": "Sucessfully deleted user: " + username,
                                "message_style": "success",
                        });
                    });
                }
            }
        })
    });
}