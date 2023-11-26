const connection = require('../connection');

module.exports = function (app) {
    app.get('/account', function (request, response) {
        response.render("account", {  });
    });
}