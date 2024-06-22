const express = require('express');
const mongoose = require('mongoose');
const seedDatabaseRoute = require('./routes/seedDatabase');
const listTransactionsRoute = require('./routes/listTransactions');
const statistics = require('./routes/statistics');
const barChart = require('./routes/barChart');
const pieChart = require('./routes/pieChart');
const combinedData = require('./routes/combinedData');
const cors = require('cors');

const dotenv = require('dotenv');
const app = express();
dotenv.config();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cors()); 

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.log(err));

app.use('/seed-database', seedDatabaseRoute);
app.use('/list-transactions', listTransactionsRoute);
app.use('/statistics', statistics);
app.use('/bar-chart', barChart);
app.use('/pie-chart', pieChart);
app.use('/combined-data', combinedData)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
