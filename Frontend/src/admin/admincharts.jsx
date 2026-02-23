// import { useState, useEffect } from "react";
// import axios from "axios";
// import {
//   BarChart, Bar, XAxis, YAxis, Tooltip,
//   LineChart, Line, PieChart, Pie, Cell
// } from "recharts";

// const [categoryData, setCategoryData] = useState([]);

// useEffect(() => {
//   axios.get("http://localhost:5000/api/admin/chart/category-orders")
//     .then(res => setCategoryData(res.data));
// }, []);

// // const orderData = [
// //   { month: "Jan", orders: 40 },
// //   { month: "Feb", orders: 55 },
// //   { month: "Mar", orders: 70 },
// //   { month: "Apr", orders: 90 },
// // ];

// // const revenueData = [
// //   { month: "Jan", revenue: 40000 },
// //   { month: "Feb", revenue: 55000 },
// //   { month: "Mar", revenue: 72000 },
// //   { month: "Apr", revenue: 95000 },
// // ];

// // const categoryData = [
// //   { name: "Mobiles", value: 45 },
// //   { name: "TVs", value: 30 },
// //   { name: "Laptops", value: 25 },
// // ];
// useEffect(() => {
//   axios.get("http://localhost:5000/api/admin/chart/orders-week")
//     .then(res => setOrderData(res.data));

//   axios.get("http://localhost:5000/api/admin/chart/revenue-week")
//     .then(res => setRevenueData(res.data));

//   axios.get("http://localhost:5000/api/admin/chart/categories")
//     .then(res => setCategoryData(res.data));
// }, []);

// const COLORS = ["#0a58ca", "#198754", "#ffc107"];

// const AdminCharts = () => {
//   return (
//     <div className="chart-grid">

//       {/* Orders Chart */}
//       <div className="chart-box">
//         <h3>Monthly Orders</h3>
//         <BarChart width={300} height={250} data={orderData}>
//   <XAxis dataKey="week" />
//   <YAxis />
//   <Tooltip />
//   <Bar dataKey="orders" fill="#0a58ca" />
// </BarChart>

//       </div>

//       {/* Revenue Chart */}
//       <div className="chart-box">
//         <h3>Revenue Growth</h3>
//         <LineChart width={300} height={250} data={revenueData}>
//   <XAxis dataKey="week" />
//   <YAxis />
//   <Tooltip />
//   <Line type="monotone" dataKey="revenue" stroke="#198754" />
// </LineChart>

//       </div>

//       {/* Category Pie */}
//       <div className="chart-box">
//         <h3>Product Categories</h3>
//         <PieChart width={320} height={260}>
//   <Pie
//     data={categoryData}
//     dataKey="value"
//     nameKey="name"
//     cx="50%"
//     cy="50%"
//     outerRadius={90}
//     label
//   >
//     {categoryData.map((_, index) => (
//       <Cell key={index} fill={COLORS[index % COLORS.length]} />
//     ))}
//   </Pie>
//   <Tooltip />
// </PieChart>

//       </div>

//     </div>
//   );
// };

// export default AdminCharts;

import { useState, useEffect } from "react";
import axios from "axios";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  LineChart, Line, PieChart, Pie, Cell,ResponsiveContainer 
} from "recharts";
import "./AdminCharts.css";

const COLORS = ["#0a58ca", "#198754", "#ffc107", "#dc3545"];

const AdminCharts = () => {

  // ✅ ALL STATES INSIDE COMPONENT
  const [orderData, setOrderData] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);

  // ✅ ALL EFFECTS INSIDE COMPONENT
  useEffect(() => {
    // console.log("CATEGORY DATA 👉", categoryData);

    axios.get("http://localhost:5000/api/admin/chart/orders-week")
      .then(res => setOrderData(res.data));

    axios.get("http://localhost:5000/api/admin/chart/revenue-week")
      .then(res => setRevenueData(res.data));

    axios.get("http://localhost:5000/api/admin/chart/category-orders")
      .then(res =>{
        console.log("raw data 👉", res.data);
        
        const formattedData = res.data.map(item => ({
      name: item.name,          // 👈 backend key
      value: Number(item.value)     // 👈 backend key
    }));

    console.log("FORMATTED FOR PIE 👉", formattedData);
         setCategoryData(formattedData);

  });
}, []);

  return (
    <div className="chart-grid">

      {/* Orders Chart */}
      <div className="chart-box">
        <h3>Weekly Orders</h3>
        <BarChart width={300} height={250} data={orderData}>
          <XAxis dataKey="week" 
            label={{ value: "Weeks", position: "insideBottom", offset: -5 }}/>
          <YAxis />
          <Tooltip />
          <Bar dataKey="orders" fill="#0a58ca"  barSize={40} radius={[6, 6, 0, 0]}/>
        </BarChart>
      </div>

      {/* Revenue Chart */}
      <div className="chart-box">
        <h3>Weekly Revenue</h3>
        <LineChart width={300} height={250} data={revenueData}>
          <XAxis dataKey="week"
          label={{ value: "Weeks", position: "insideBottom", offset: -5 }} />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="revenue"  dot stroke="#198754" />
        </LineChart>
      </div>

      {/* Category Pie Chart */}
      <div className="chart-box">
        <h3>Category-wise Orders</h3>
        
        <ResponsiveContainer width="100%" height="90%">
          <PieChart>
          <Pie
            data={categoryData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={90}
            label={({ name, value }) => `${name} (${value})`}
          >
            {categoryData.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
         </ResponsiveContainer>
      </div>

    </div>
  );
};

export default AdminCharts;
