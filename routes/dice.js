const express = require('express');
const router = express.Router();


// Define your array of products
const products = [
    {
        id: 1,
        name: 'Firey',
        description: '',
        price: 29.99,
        image: 'Frontend/Assets/dice1.png',
    },
    {
        id: 2,
        name: 'Witchy',
        description: '',
        price: 34.99,
        image: 'Frontend/Assets/dice2.png',
    },
    {
        id: 3,
        name: 'Popsicle',
        description: '',
        price: 34.99,
        image: 'Frontend/Assets/dice3.png',
    },
    {
        id: 4,
        name: 'Earthy',
        description: '',
        price: 34.99,
        image: 'Frontend/Assets/dice4.png',
    },
    {
        id: 5,
        name: 'Galaxy',
        description: '',
        price: 34.99,
        image: 'Frontend/Assets/dice5.png',
    },
    {
        id: 6,
        name: 'Glacier',
        description: '',
        price: 29.99,
        image: 'Frontend/Assets/dice6.png',
    },
    {
        id: 7,
        name: 'Neon',
        description: '',
        price: 39.99,
        image: 'Frontend/Assets/dice7.png',
    },
    {
        id: 8,
        name: 'Mystic',
        description: '',
        price: 32.99,
        image: 'Frontend/Assets/dice8.png',
    },
    {
        id: 9,
        name: 'Royal',
        description: '',
        price: 36.99,
        image: 'Frontend/Assets/dice9.png',
    },
    {
        id: 10,
        name: 'Sunrise',
        description: '',
        price: 28.99,
        image: 'Frontend/Assets/dice10.png',
    },

];


// This block logs information and renders the 'dice' template with the 'products' data
router.get('/', function (request, response) {
    console.log('Accessed /dice route');
    console.log('Products:', products);
    response.render('dice', { products });
});

// Sort products by price
router.get('/sort-by-price', function (request, response) {
    const sortedProducts = [...products].sort((a, b) => a.price - b.price);
    response.render('dice', { products: sortedProducts });
});


// Add item to the cart
router.post('/add-to-cart/:productId', function (request, response) {
    const productId = parseInt(request.params.productId, 10);
    
    // Find the product in the array
    const selectedProduct = products.find(product => product.id === productId);

    if (selectedProduct) {
        // Add the product to the cart in the session
        if (!request.session.cart) {
            request.session.cart = [];
        }

        request.session.cart.push(selectedProduct);
        response.redirect('/dice');
    } else {
        response.status(404).send('Product not found');
    }
});

module.exports = router;

