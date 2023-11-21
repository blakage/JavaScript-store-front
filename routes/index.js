const connection = require('../connection');
userManager = require("../userManager.js");

module.exports = function (app) {
    app.get('/', function (request, response) {
        console.log(userManager.getUsernameFromSessionID(request.cookies.sessionId));
        response.render("index", {  });
    });
}