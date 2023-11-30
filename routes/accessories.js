const express = require('express');
const router = express.Router();


// Define your array of products
const products = [
    {
        id: 1,
        name: 'Steel Tower',
        description: '',
        price: 29.99,
        image: 'Frontend/Assets/dice-tower1.png',
    },
    {
        id: 2,
        name: 'Wood Tower',
        description: '',
        price: 24.99,
        image: 'Frontend/Assets/dice-tower2.png',
    },
    {
        id: 3,
        name: 'Velvet Mat',
        description: '',
        price: 19.99,
        image: 'Frontend/Assets/dice-mat1.png',
    },
    {
        id: 4,
        name: 'Leather Mat',
        description: '',
        price: 39.99,
        image: 'Frontend/Assets/dice-mat2.png',
    },
    {
        id: 5,
        name: 'Iron Jail',
        description: '',
        price: 14.99,
        image: 'Frontend/Assets/dice-jail1.png',
    },
    {
        id: 6,
        name: 'Wood Jail',
        description: '',
        price: 24.99,
        image: 'Frontend/Assets/dice-jail2.png',
    },
    {
        id: 7,
        name: 'Metal Box',
        description: '',
        price: 29.99,
        image: 'Frontend/Assets/dice-box1.png',
    },
    {
        id: 8,
        name: 'Wooden Box',
        description: '',
        price: 19.99,
        image: 'Frontend/Assets/dice-box2.png',
    },
];


// This block logs information and renders the 'dice' template with the 'products' data
router.get('/', function (request, response) {
    console.log('Accessed /accessories route');
    console.log('Products:', products);
    response.render('accessories', { products });
});

// Sort products by price
router.get('/sort-by-price', function (request, response) {
    const sortedProducts = [...products].sort((a, b) => a.price - b.price);
    response.render('accessories', { products: sortedProducts });
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
        response.redirect('/accessories');
    } else {
        response.status(404).send('Product not found');
    }
});

module.exports = router;

