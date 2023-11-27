const sequelize = require('../sequelize_conn');
const Product = require('../models/Product.model');

module.exports = function (app) {
    app.get('/dice', function (request, response) {

        // insert test:
        /*
        sequelize.sync().then(() => {
            Product.create({
                name: "product",
                price: 5.99,
                category: 0,
            }).then(res => {
                console.log(res);
            })
        })
        */

        sequelize.sync().then(() => {
            Product.findAll().then(res => {
                console.log(res);
            })
        })
        response.render("dice", {  });
    });
}