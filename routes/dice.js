const connection = require('../connection');

module.exports = function (app) {
    app.get('/dice', function (request, response) {
        response.render("dice", {  });
    });
}