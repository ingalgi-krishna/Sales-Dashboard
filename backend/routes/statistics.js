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
                    sold: { $ifNull: [ "$sold", false ] } // Default to false if sold field does not exist
                }
            },
            {
                $match: { month: monthInt }
            },
            {
                $group: {
                    _id: null,
                    totalSaleAmount: { $sum: { $cond: { if: "$sold", then: "$price", else: 0 } } },
                    totalSoldItems: { $sum: { $cond: { if: "$sold", then: 1, else: 0 } } },
                    totalNotSoldItems: { $sum: { $cond: { if: { $eq: ["$sold", false] }, then: 1, else: 0 } } }
                }
            }
        ];

        const result = await Product.aggregate(pipeline);

        const statistics = {
            totalSaleAmount: result.length > 0 ? result[0].totalSaleAmount : 0,
            totalSoldItems: result.length > 0 ? result[0].totalSoldItems : 0,
            totalNotSoldItems: result.length > 0 ? result[0].totalNotSoldItems : 0
        };

        res.status(200).json(statistics);
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred');
    }
});

module.exports = router;
