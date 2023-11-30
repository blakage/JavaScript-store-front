// Import your connection module if needed
// const connection = require('../connection');

module.exports = function (app) {
    app.get('/cart', function (request, response) {
        // Get the cart from the session
        const cart = request.session.cart || [];

        // Calculate the total price of items in the cart
        const totalPrice = cart.reduce((total, product) => total + product.price, 0);

        response.render("cart", { cart, totalPrice });
    });
};
