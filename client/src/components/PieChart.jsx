import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
const PieChartComponent = ({ month }) => {
  const [data, setData] = useState([]);
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#845EC2', '#D65DB1', '#FF6F91', '#FF9671', '#FFC75F', '#F9F871'];

  useEffect(() => {
    fetchPieChartData();
  }, [month]);

  const fetchPieChartData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/pie-chart', {
        params: { month },
      });
      setData(response.data);
    } catch (error) {
      console.error('Error fetching pie chart data:', error);
    }
  };

  const getMonthName = (monthNumber) => {
    const date = new Date();
    date.setMonth(monthNumber - 1);
    return date.toLocaleString('default', { month: 'long' });
  };

  return (
    <div className='piechart'>
      <h2>Pie Chart for {getMonthName(month)}</h2>
      <PieChart width={400} height={400}>
        <Pie
          data={data}
          dataKey="count"
          nameKey="category"
          cx="50%"
          cy="50%"
          outerRadius={150}
          fill="#8884d8"
          label
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
};

export default PieChartComponent;
