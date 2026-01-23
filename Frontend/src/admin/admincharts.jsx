import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  LineChart, Line, PieChart, Pie, Cell
} from "recharts";

const orderData = [
  { month: "Jan", orders: 40 },
  { month: "Feb", orders: 55 },
  { month: "Mar", orders: 70 },
  { month: "Apr", orders: 90 },
];

const revenueData = [
  { month: "Jan", revenue: 40000 },
  { month: "Feb", revenue: 55000 },
  { month: "Mar", revenue: 72000 },
  { month: "Apr", revenue: 95000 },
];

const categoryData = [
  { name: "Mobiles", value: 45 },
  { name: "TVs", value: 30 },
  { name: "Laptops", value: 25 },
];

const COLORS = ["#0a58ca", "#198754", "#ffc107"];

const AdminCharts = () => {
  return (
    <div className="chart-grid">

      {/* Orders Chart */}
      <div className="chart-box">
        <h3>Monthly Orders</h3>
        <BarChart width={300} height={250} data={orderData}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="orders" fill="#0a58ca" />
        </BarChart>
      </div>

      {/* Revenue Chart */}
      <div className="chart-box">
        <h3>Revenue Growth</h3>
        <LineChart width={300} height={250} data={revenueData}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="revenue" stroke="#198754" />
        </LineChart>
      </div>

      {/* Category Pie */}
      <div className="chart-box">
        <h3>Product Categories</h3>
        <PieChart width={300} height={250}>
          <Pie data={categoryData} dataKey="value" cx="50%" cy="50%" outerRadius={80}>
            {categoryData.map((_, index) => (
              <Cell key={index} fill={COLORS[index]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </div>

    </div>
  );
};

export default AdminCharts;
