const connection = require('../connection');

module.exports = function (app) {
    app.get('/account', function (request, response) {
        // Only allow access if authenticated:
        const username = userManager.getUsernameFromSessionID(request.cookies.sessionId);
        if (username == null) {
            // Not logged in.
            return response.render("login", {
                message: "You must be logged in to do that.",
                message_style: "danger",
            });
        }
        response.render("account", {  });
    });
}