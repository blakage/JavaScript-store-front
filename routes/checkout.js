module.exports = function (app) {
    app.get('/checkout', function (request, response) {
        // Get the cart from the session
        const cart = request.session.cart || [];
        console.log('Cart in checkout route:', cart);
    
        // You can add other data you want to pass to the checkout view
        const additionalData = {
            // Add any additional data you want here
        };
    
        response.render("checkout", { cart, ...additionalData });
    });

    app.post('/checkout', function (request, response) {
        if (request.session.cart) {
            request.session.cart = [];
        }
        response.redirect("/checkout");
    });
    
};
