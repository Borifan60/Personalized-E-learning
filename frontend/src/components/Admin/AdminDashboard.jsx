import Sidebar from "./Sidebar";
import DashboardChart from "./DashboardChart";

function AdminDashboard() {
    return (
        <>
        <div className="main-content">
        <Sidebar />

<div className="content">
  <h2>Dashboard</h2>
  <hr />
  {/* Chart */}
  <DashboardChart />
</div>
</div>
    </>
    );
}

export default AdminDashboard;