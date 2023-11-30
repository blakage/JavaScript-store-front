// cart.js
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

    app.post('/delete-product', function (request, response) {
        const { index } = request.body;

        // Get the cart from the session
        const cart = request.session.cart || [];

        // Remove the product at the specified index
        if (index !== undefined && index >= 0 && index < cart.length) {
            cart.splice(index, 1);
            request.session.cart = cart;
        }

        // Redirect back to the cart page
        response.redirect('/cart');
    });
};
