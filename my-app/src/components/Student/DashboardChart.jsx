// src/components/DashboardChart.jsx
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

const data = [
  { name: "Jan", students: 40, courses: 5 },
  { name: "Feb", students: 60, courses: 8 },
  { name: "Mar", students: 50, courses: 6 },
  { name: "Apr", students: 70, courses: 9 },
  { name: "May", students: 90, courses: 12 },
];

function DashboardChart() {
  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="students" stroke="#1e3a8a" activeDot={{ r: 8 }} />
          <Line type="monotone" dataKey="courses" stroke="#ff9900" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default DashboardChart;
