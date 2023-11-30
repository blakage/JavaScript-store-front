const express = require('express');
const router = express.Router();

module.exports = function (app) {
    console.log('Setting up /cart route...');

    app.get('/cart', function (request, response) {
        console.log('GET request to /cart received');

        // Get the cart from the session
        const cart = request.session.cart || [];

        // Calculate the total price of items in the cart
        const totalPrice = cart.reduce((total, product) => total + product.price, 0);

        response.render("cart", { cart, totalPrice });
    });
};
