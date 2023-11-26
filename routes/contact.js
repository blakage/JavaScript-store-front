const connection = require('../connection');

module.exports = function (app) {
    app.get('/contact', function (request, response) {
        response.render("contact", {  });
    });
}