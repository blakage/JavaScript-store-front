const connection = require('../connection');

module.exports = function (app) {
    app.get('/checkout', function (request, response) {
        response.render("checkout", {  });
    });
}