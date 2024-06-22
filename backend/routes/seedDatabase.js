const express = require('express');
const axios = require('axios');
const Product = require('../models/Product');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
        const products = response.data;

        // Clear previous data
        await Product.deleteMany({});
        
        // Inserting new data
        await Product.insertMany(products);
        
        res.status(200).send('Database seeded successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred');
    }
});

module.exports = router;
