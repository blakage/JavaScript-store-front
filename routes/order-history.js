const connection = require('../connection');

module.exports = function (app) {
    app.get('/order-history', function (request, response) {
        response.render("order-history", {  });
    });
}