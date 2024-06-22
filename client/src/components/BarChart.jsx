import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js/auto';

ChartJS.register(...registerables);

const BarChartComponent = ({ month }) => {
    const [chartData, setChartData] = useState({ labels: [], data: [] });

    useEffect(() => {
        fetchBarChartData();
    }, [month]);

    const fetchBarChartData = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/bar-chart`, {
                params: { month }
            });

            const { labels, data } = response.data;

            setChartData({ labels, data });
        } catch (error) {
            console.error('Error fetching bar chart data:', error);
        }
    };

    const options = {
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 1
                }
            }
        }
    };


    const getMonthName = (monthNumber) => {
        const date = new Date();
        date.setMonth(monthNumber - 1);
        return date.toLocaleString('default', { month: 'long' });
      };

      
    return (
        <div className="bar-chart-container">
            <h2>Price Range Distribution for {getMonthName(month)}</h2>
            <div className="bar-chart">
                <Bar
                    data={{
                        labels: chartData.labels,
                        datasets: [{
                            label: 'Number of Items',
                            data: chartData.data,
                            backgroundColor: [
                                '#3e95cd', '#8e5ea2', '#3cba9f', '#e8c3b9',
                                '#c45850', '#ff6384', '#36a2eb', '#ffce56',
                                '#4bc0c0', '#ff9f40'
                            ]
                        }]
                    }}
                    options={options}
                />
            </div>
        </div>
    );
};

export default BarChartComponent;
