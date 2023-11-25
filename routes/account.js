const connection = require('../connection');
const sanitizer = require("sanitize")();

function getAccountInfo(username, callback) {
    var query = connection.query("SELECT * FROM Accounts WHERE username=" + connection.escape(username), 
    function (error, result) {
        if (error) {
            callback(error, []);
        } else {
            callback(null, result[0])
        }
    });
}

function sendResponse(response, username, message, message_style) {
    getAccountInfo(username, function (error, result) {
        response.render("account", {
            "message": message,
            "message_style": message_style,
            "user": result,
        });
    })
}

module.exports = function (app) {
    app.get('/account', function (request, response) {
        // Only allow access if authenticated:
        const username = request.session.username;
        if (username == null) {
            // Not logged in.
            return response.render("login", {
                message: "You must be logged in to do that.",
                message_style: "danger",
            });
        }

        // Wrap in getAccountInfo:
        sendResponse(response, username, null, null);
    });

    app.get("/user/validate", function(request, response) {
        const username = request.query.username;
        var query = connection.query("SELECT * FROM Accounts WHERE username=" + connection.escape(username),
            function (error, result) {
                return response.json({ "success": result.length > 0 });
            });
    })

    // Update Account Inforamtion
    app.post("/account", function(request, response) {
        var {username, action_type} = request.body;
        action_type = sanitizer.value(action_type, 'str');

        // Update Account:
        if (action_type === "update_account") {
            username = sanitizer.value(username, 'str');

            // Ensure that the username is available (similar functionality to user/validate,
            // but on the server as well BEFORE making an update sql operation):
            var query = connection.query("SELECT * FROM Accounts WHERE username=" + connection.escape(username),
            function(error, result) {
                if (!error) {
                    // Check if this username is taken and that it's not our current one.
                    if ((result[0] != null) && username !== request.session.username) {
                        sendResponse(response,
                            request.session.username,
                            "Username is already taken.",
                            "danger");
                    } else {
                        // Update:
                        var query = connection.query("UPDATE Accounts SET username=" +
                            connection.escape(username) + "WHERE username=" + connection.escape(request.session.username),
                            function (error, result) {
                                if (!error) {
                                    return sendResponse(response,
                                        username,
                                        "Successfully updated username to: " + username,
                                        "success");
                                }
                            }
                        );
                    }
                }
            });
        }

    })
}