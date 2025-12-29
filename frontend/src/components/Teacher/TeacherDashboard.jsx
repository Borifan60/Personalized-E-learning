import Sidebar from "./Sidebar";
import DashboardChart from "./DashboardChart";

function TeacherDashboard() {
    return (
        <>
         <div className="main-content">
            <Sidebar />

            <div className="content">
            <div>
                <h2>Dashboard</h2>
                <hr />
                {/* Chart */}
                <DashboardChart />
            </div>
            </div>
            </div>
         </>
    );
}

export default TeacherDashboard;