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
                    month: { $month: "$dateOfSale" },
                    priceRange: {
                        $switch: {
                            branches: [
                                { case: { $and: [{ $gte: ["$price", 0] }, { $lte: ["$price", 100] }] }, then: "0 - 100" },
                                { case: { $and: [{ $gte: ["$price", 101] }, { $lte: ["$price", 200] }] }, then: "101 - 200" },
                                { case: { $and: [{ $gte: ["$price", 201] }, { $lte: ["$price", 300] }] }, then: "201 - 300" },
                                { case: { $and: [{ $gte: ["$price", 301] }, { $lte: ["$price", 400] }] }, then: "301 - 400" },
                                { case: { $and: [{ $gte: ["$price", 401] }, { $lte: ["$price", 500] }] }, then: "401 - 500" },
                                { case: { $and: [{ $gte: ["$price", 501] }, { $lte: ["$price", 600] }] }, then: "501 - 600" },
                                { case: { $and: [{ $gte: ["$price", 601] }, { $lte: ["$price", 700] }] }, then: "601 - 700" },
                                { case: { $and: [{ $gte: ["$price", 701] }, { $lte: ["$price", 800] }] }, then: "701 - 800" },
                                { case: { $and: [{ $gte: ["$price", 801] }, { $lte: ["$price", 900] }] }, then: "801 - 900" },
                                { case: { $gte: ["$price", 901] }, then: "901-above" }
                            ]
                        }
                    }
                }
            },
            {
                $match: { month: monthInt }
            },
            {
                $group: {
                    _id: "$priceRange",
                    count: { $sum: 1 }
                }
            }
        ];

        const result = await Product.aggregate(pipeline);

        const chartData = {
            labels: [],
            data: []
        };

        const priceRanges = [
            "0 - 100", "101 - 200", "201 - 300", "301 - 400",
            "401 - 500", "501 - 600", "601 - 700", "701 - 800",
            "801 - 900", "901-above"
        ];

        priceRanges.forEach(range => {
            const foundRange = result.find(item => item._id === range);
            const count = foundRange ? foundRange.count : 0;
            chartData.labels.push(range);
            chartData.data.push(count);
        });

        res.status(200).json(chartData);
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred');
    }
});

module.exports = router;
