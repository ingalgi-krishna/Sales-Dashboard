const express = require('express');
const axios = require('axios');

const router = express.Router();

const fetchData = async (url) => {
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error(`Error fetching data from ${url}:`, error.message);
        return null;
    }
};

router.get('/', async (req, res) => {
    try {
        const { month } = req.query;

        if (!month) {
            return res.status(400).send('Month parameter is required');
        }

        const statisticsUrl = `http://localhost:5000/statistics?month=${month}`;
        const barChartUrl = `http://localhost:5000/bar-chart?month=${month}`;
        const pieChartUrl = `http://localhost:5000/pie-chart?month=${month}`;

        const [statisticsData, barChartData, pieChartData] = await Promise.all([
            fetchData(statisticsUrl),
            fetchData(barChartUrl),
            fetchData(pieChartUrl)
        ]);

        const combinedData = {
            month: parseInt(month),
            statistics: statisticsData,
            barChart: barChartData,
            pieChart: pieChartData
        };

        res.status(200).json(combinedData);
    } catch (error) {
        console.error('Error fetching combined data:', error.message);
        res.status(500).send('An error occurred while fetching combined data');
    }
});

module.exports = router;
