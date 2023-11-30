const express = require('express');
const router = express.Router();


// Define your array of products
const products = [
    {
        id: 1,
        name: 'Steel Tower',
        description: 'A sturdy steel dice tower designed for precision rolls.',
        price: 29.99,
        image: 'Frontend/Assets/dice-tower1.png',
    },
    {
        id: 2,
        name: 'Wood Tower',
        description: 'Handcrafted wooden dice tower, perfect for a touch of elegance in your rolls.',
        price: 24.99,
        image: 'Frontend/Assets/dice-tower2.png',
    },
    {
        id: 3,
        name: 'Velvet Mat',
        description: 'Soft velvet surface, providing a comfortable area for dice rolling.',
        price: 19.99,
        image: 'Frontend/Assets/dice-mat1.png',
    },
    {
        id: 4,
        name: 'Leather Mat',
        description: 'Premium quality leather mat for a luxurious rolling experience.',
        price: 39.99,
        image: 'Frontend/Assets/dice-mat2.png',
    },
    {
        id: 5,
        name: 'Iron Jail',
        description: 'Durable iron dice jail to lock away those unlucky dice.',
        price: 14.99,
        image: 'Frontend/Assets/dice-jail1.png',
    },
    {
        id: 6,
        name: 'Wood Jail',
        description: 'Artistically designed wooden dice jail to add style to your gaming table.',
        price: 24.99,
        image: 'Frontend/Assets/dice-jail2.png',
    },
    {
        id: 7,
        name: 'Metal Box',
        description: 'Sleek metal box, offering a modern touch to dice storage.',
        price: 29.99,
        image: 'Frontend/Assets/dice-box1.png',
    },
    {
        id: 8,
        name: 'Wooden Box',
        description: 'Handcrafted wooden box to keep your dice collection safe.',
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

