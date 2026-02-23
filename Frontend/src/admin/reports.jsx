import React, { useState, useEffect } from "react";
import { Bar, Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";
import "./reports.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Reports = () => {
  const [data, setData] = useState({});
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    fetch(`http://localhost:5000/admin/reports?month=${month}&year=${year}`)
      .then(res => res.json())
      .then(result => setData(result))
      .catch(err => console.log(err));
  }, [month, year]);

  const months = [
  "Jan", "Feb", "Mar", "Apr",
  "May", "Jun", "Jul", "Aug",
  "Sep", "Oct", "Nov", "Dec"
];

  const weeklyChart = {
    
    labels: data.weekly_data?.map(w => `Week ${w.week}`) || [],
    datasets: [
      {
        label: "Weekly Revenue",
        data: data.weekly_data?.map(w => w.revenue) || [],
        backgroundColor: "rgba(54, 162, 235, 0.6)"
      }
    ]
  };
  const weeklyOptions = {
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top"
    }
  }
};

//  const centerTextPlugin = (total) => ({
//   id: "centerText",
//   beforeDraw: (chart) => {
//     const { width } = chart;
//     const { height } = chart;
//     const ctx = chart.ctx;

//     ctx.restore();

//     ctx.font = "bold 22px Arial";
//     ctx.textBaseline = "middle";
//     ctx.fillStyle = "#333";

//     const text = total ? total : 0;

//     const textX = Math.round((width - ctx.measureText(text).width) / 2);
//     const textY = height / 2;

//     ctx.fillText(text, textX, textY);
//     ctx.save();
//   }
// });

  const categoryChartOptions = {
  maintainAspectRatio: false,
  layout: {
    padding: {
      right: 40
    }
  },
  plugins: {
    legend: {
      position: "right",
      labels: {
        boxWidth: 16,
        padding: 15
      }
    }
  },
  cutout: "65%"
};



  const categoryChart = {
    labels: data.category_data?.map(c => c.category) || [],
    datasets: [
      {
        data: data.category_data?.map(c => c.total_sold) || [],
        backgroundColor: [
          "#4CAF50",
          "#2196F3",
          "#FF9800",
          "#9C27B0",
          "#E91E63"
        ]
      }
    ]
  };

  return (
    <div className="reports-container">
      <h2>Reports</h2>

      {/* Filters */}
      <div className="filters">
        <select value={month} onChange={e => setMonth(e.target.value)}>
  {months.map((m, index) => (
    <option key={index + 1} value={index + 1}>
      {m}
    </option>
  ))}
</select>


        <select value={year} onChange={e => setYear(e.target.value)}>
          <option value="2025">2025</option>
          <option value="2026">2026</option>
        </select>
      </div>

      {/* KPI Cards */}
      <div className="kpi-cards">
        <div className="card">
          <h4>Total Orders</h4>
          <p>{data.total_orders || 0}</p>
        </div>

        <div className="card">
          <h4>Total Revenue</h4>
          <p>₹{data.total_revenue || 0}</p>
        </div>

        <div className="card">
          <h4>Products Sold</h4>
          <p>{data.total_products || 0}</p>
        </div>

        <div className="card">
          <h4>Avg Order Value</h4>
          <p>₹{Math.round(data.avg_order_value || 0)}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="charts">
        <div className="chart-box">
          <Line data={weeklyChart} options={weeklyOptions} />
        </div>

        <div className="chart-box">
         <Doughnut data={categoryChart} options={categoryChartOptions} 
          // plugins={[centerTextPlugin(data.total_products)]}
           />

        </div>
      </div>
    </div>
  );
};

export default Reports;
