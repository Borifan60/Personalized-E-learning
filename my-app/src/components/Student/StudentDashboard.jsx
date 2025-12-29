
import Sidebar from "./Sidebar";
import DashboardChart from "./DashboardChart";

function StudentDashboard() {

  // ✅ get firstname saved during login
  const firstname = localStorage.getItem("firstname");

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

export default StudentDashboard;
