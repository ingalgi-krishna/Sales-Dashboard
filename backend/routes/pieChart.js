const express = require('express');
const Product = require('../models/Product');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const { month } = req.query;

        if (!month) {
            return res.status(400).send('Month parameter is required');
        }

        const monthInt = parseInt(month);
        if (isNaN(monthInt) || monthInt < 1 || monthInt > 12) {
            return res.status(400).send('Invalid month value');
        }

        const pipeline = [
            {
                $addFields: {
                    month: { $month: "$dateOfSale" }
                }
            },
            {
                $match: { month: monthInt }
            },
            {
                $group: {
                    _id: "$category",
                    count: { $sum: 1 }
                }
            }
        ];

        const result = await Product.aggregate(pipeline);

        const pieChartData = result.map(item => ({
            category: item._id,
            count: item.count
        }));

        res.status(200).json(pieChartData);
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred');
    }
});

module.exports = router;
