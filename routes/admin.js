const connection = require('../connection');

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
        response.render("admin", {});
    });
}