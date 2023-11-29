const { where } = require('sequelize');
const connection = require('../connection');
const sanitizer = require("sanitize")();
const multer = require('multer');
const upload = multer({storage: multer.memoryStorage()})

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
    app.post("/account", upload.single("image"), function(request, response) {
        var {username, action_type} = request.body;
        action_type = sanitizer.value(action_type, 'str');

        // Update Account:
        if (action_type === "update_account") {
            username = sanitizer.value(username, 'str');
            
            // Check for a profile image:
            var encoded_image = null;
            if (request.file) {
                console.log(request.file.buffer);
                encoded_image = request.file.buffer.toString("base64");
            }

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
                        // Where:
                        const where_query = " WHERE username=" + connection.escape(request.session.username);
    
                        // Update (different queries depending on if encoded_image is supplied):
                        var queryString = "UPDATE Accounts SET username=" + connection.escape(username)
                        var responseMessage = "Successfully updated username to: " + username;
                        if (encoded_image) {
                            queryString += ",image=" + connection.escape(encoded_image)
                            responseMessage += " and set a profile image.";
                        }
                        queryString += where_query;

                        var query = connection.query(queryString,
                            function (error, result) {
                                if (!error) {
                                    return sendResponse(response,
                                        username,
                                        responseMessage,
                                        "success");
                                } else {
                                    console.log(error);
                                }
                            }
                        );
                    }
                }
            });
        }

    })
}