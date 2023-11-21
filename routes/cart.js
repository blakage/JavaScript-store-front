const connection = require('../connection');

module.exports = function (app) {
    app.get('/cart', function (request, response) {
        response.render("cart", {  });
    });
}