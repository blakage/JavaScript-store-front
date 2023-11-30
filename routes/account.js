const sanitizer = require("sanitize")();
const fs = require('fs');
const path = require('path')

const sequelize = require('../sequelize_conn');
const User = require("../models/User.model");

// Files:
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './media')
    },
    filename: function (req, file, cb) {
        cb(null, Buffer.from(file.originalname + Date.now()).toString("base64") + path.extname(file.originalname));
    }
})
const upload = multer({
    storage: storage,
    fileFilter: function(_req, file, cb) {
        validateFileType(file, cb);
    },
})

// Excludes checking mime-time from buffer because extension (file-types) requires ESM.
function validateFileType(file, cb) {
    // Validate filetype 
    const filetypes = /jpeg|jpg|png/;

    // Check mime
    const mimetype = filetypes.test(file.mimetype);
    return cb(null, mimetype);
}

async function getAccountInfo(username, callback) {
    const result = await User.findOne({"where": {username: username}});
    callback(result);
}

async function sendResponse(response, username, message, message_style) {
    await getAccountInfo(username, function (result) {
        response.render("account", {
            "message": message,
            "message_style": message_style,
            "user": result,
        });
    })
}

module.exports = function (app) {
    app.get('/account', async function (request, response) {
        // Only allow access if authenticated:
        const username = request.session.username;
        if (username == null) {
            // Not logged in.
            return response.render("login", {
                message: "You must be logged in to do that.",
                message_style: "danger",
            });
        }
        if (session.message) {
            session.message = false;
            return await sendResponse(response,
                username,
                "Welcome back, " + username + "!",
                "success");
        }

        // Wrap in getAccountInfo:
        await sendResponse(response, username,null, null);
    });

    app.get("/user/validate", async function(request, response) {
        const username = request.query.username;
        const result = await User.findOne({"where": {username: username}});
        return response.json({"success": result != null});
    })

    // Update Account Inforamtion
    app.post("/account", upload.single("image"), async function(request, response) {
        var {username, action_type} = request.body;
        action_type = sanitizer.value(action_type, 'str');

        // Update Account:
        if (action_type === "update_account") {
            username = sanitizer.value(username, 'str');
            var responseMessage = "Successfully updated username to: " + username;

            // Ensure that the username is available (similar functionality to user/validate,
            // but on the server as well BEFORE making an update sql operation):
            const result = await User.findOne({"where": {username: username}});

            // Check if username is taken and that it's not our current one:
            if (result != null && username !== request.session.username) {
                return await sendResponse(response,
                    request.session.username,
                    "Username is already taken.",
                    "danger");
            }

            const active_user = await User.findOne({"where": {username: request.session.username}});
 
            // Check for a profile image:
            var encoded_image = active_user.image;
            if (request.file) {
                encoded_image = request.file.filename;
                responseMessage += " and set a profile image.";
                // If we're linked to a current file, we need to delete it:
                if (active_user.image) {
                    // If we're linked to a current file, we need to delete it:
                    fs.unlink("./media/" + active_user.image, (err => {
                        console.log(err);
                    }));
                }
            }

            // Update:
            await User.update({
                username: username,
                image: encoded_image,
            }, {
                where: {
                    username: request.session.username,
                }
            });
            // Update session:
            request.session.username = username;
            request.session.user[0] = username;
            return await sendResponse(response, username, responseMessage, "success");
        }
    })
}