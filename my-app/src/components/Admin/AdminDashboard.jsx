import Header from "../Header";
import Sidebar from "./Sidebar";
import Footer from "../Footer";

function AdminDashboard() {
    return (
        <>
            <div className="main-content">

            <Sidebar />
            <div className="content">
                <h3>Admin Dashboard</h3>
                <p>Announcements and Calendar will be here...</p>
            </div>
            </div>
    </>
    );
}

export default AdminDashboard;