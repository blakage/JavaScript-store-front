const bcrypt = require("bcrypt");

module.exports = function (app) {
    app.post('/', (request, response) => {
        const username = request.body.username;
        console.log(username);
    })
}