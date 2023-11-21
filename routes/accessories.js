const connection = require('../connection');

module.exports = function (app) {
    app.get('/accessories', function (request, response) {
        response.render("accessories", {  });
    });
}