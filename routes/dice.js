const express = require('express');
const router = express.Router();


// Define your array of products
const products = [
    {
        id: 1,
        name: 'Firey',
        description: 'A dice set with blazing colors reminiscent of a raging fire.',
        price: 29.99,
        image: 'Frontend/Assets/dice1.png',
    },
    {
        id: 2,
        name: 'Witchy',
        description: 'A mystical set of dice inspired by the world of witches and magic.',
        price: 34.99,
        image: 'Frontend/Assets/dice2.png',
    },
    {
        id: 3,
        name: 'Popsicle',
        description: 'A refreshing set of dice with colors that evoke the sweetness of a popsicle.',
        price: 34.99,
        image: 'Frontend/Assets/dice3.png',
    },
    {
        id: 4,
        name: 'Earthy',
        description: 'A dice set embodying the essence of nature with earthy tones and patterns.',
        price: 34.99,
        image: 'Frontend/Assets/dice4.png',
    },
    {
        id: 5,
        name: 'Galaxy',
        description: 'A cosmic-themed dice set reminiscent of the vastness of the galaxy.',
        price: 34.99,
        image: 'Frontend/Assets/dice5.png',
    },
    {
        id: 6,
        name: 'Glacier',
        description: 'A dice set featuring icy colors and patterns inspired by frozen glaciers.',
        price: 29.99,
        image: 'Frontend/Assets/dice6.png',
    },
    {
        id: 7,
        name: 'Neon',
        description: 'A vibrant neon-colored dice set that glows under UV light.',
        price: 39.99,
        image: 'Frontend/Assets/dice7.png',
    },
    {
        id: 8,
        name: 'Mystic',
        description: 'A mystical-themed dice set that seems to have an otherworldly aura.',
        price: 32.99,
        image: 'Frontend/Assets/dice8.png',
    },
    {
        id: 9,
        name: 'Royal',
        description: 'A regal set of dice featuring colors and designs fit for royalty.',
        price: 36.99,
        image: 'Frontend/Assets/dice9.png',
    },
    {
        id: 10,
        name: 'Sunrise',
        description: 'A dice set capturing the beauty of a vibrant sunrise with warm hues.',
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

