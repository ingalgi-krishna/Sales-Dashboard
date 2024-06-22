const express = require('express');
const Product = require('../models/Product');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const { month, search, page = 1, perPage = 10 } = req.query;

        const pageInt = parseInt(page);
        const perPageInt = parseInt(perPage);

        let pipeline = [];

        if (month) {
            const monthInt = parseInt(month);
            if (!isNaN(monthInt) && monthInt >= 1 && monthInt <= 12) {
                pipeline.push({
                    $addFields: {
                        month: { $month: "$dateOfSale" }
                    }
                });
                pipeline.push({
                    $match: { month: monthInt }
                });
            } else {
                return res.status(400).send('Invalid month value');
            }
        }

        if (search) {
            const searchRegex = new RegExp(search, 'i');

            pipeline.push({
                $match: {
                    $or: [
                        { title: searchRegex },
                        { description: searchRegex },
                        { price: { $eq: parseFloat(search) } },
                    ]
                }
            });
        }

        const totalTransactionsPipeline = [...pipeline, { $count: "totalTransactions" }];
        const totalTransactionsResult = await Product.aggregate(totalTransactionsPipeline);

        const totalTransactions = totalTransactionsResult[0]?.totalTransactions || 0;

        pipeline.push({
            $skip: (pageInt - 1) * perPageInt
        });

        pipeline.push({
            $limit: perPageInt
        });

        const transactions = await Product.aggregate(pipeline);

        res.status(200).json({
            page: pageInt,
            perPage: perPageInt,
            totalTransactions,
            totalPages: Math.ceil(totalTransactions / perPageInt),
            transactions
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred');
    }
});

module.exports = router;
