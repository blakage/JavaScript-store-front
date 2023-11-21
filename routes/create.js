const connection = require('../connection');

module.exports = function (app) {
    app.get('/create', function (request, response) {
        response.render("create", {});
    });
}