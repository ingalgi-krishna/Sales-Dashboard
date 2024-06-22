import React, { useState } from "react";
import TransactionsTable from "./components/TransactionsTable";
import Statistics from "./components/Statistics";
import BarChartComponent from "./components/BarChart";
import PieChartComponent from "./components/PieChart";
import "./App.css";

const App = () => {
  const [month, setMonth] = useState(3);

  const handleMonthChange = (event) => {
    setMonth(parseInt(event.target.value));
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Product Sales Dashboard and Visual Analytics</h1>
        <p className="greeting">Project by Krishna Ingalgi</p>
        <div className="month-select">
          <label htmlFor="month-select">Select Month:</label>
          <select
            id="month-select"
            value={month}
            onChange={handleMonthChange}
            className="month-selector"
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {new Date(0, i).toLocaleString("default", { month: "long" })}
              </option>
            ))}
          </select>
        </div>
      </header>
      <main className="main-content">
        <div className="dashboard-content">
          <TransactionsTable month={month} />
          <div className="visuals">
            <div className="statistics">
              <Statistics month={month} />
            </div>
            <div className="piechart">
              <PieChartComponent month={month} />
            </div>
          </div>
          <div className="barchart">
            <BarChartComponent month={month} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
