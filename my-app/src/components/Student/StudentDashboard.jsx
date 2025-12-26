
import Sidebar from "./Sidebar";

function StudentDashboard() {

  // ✅ get firstname saved during login
  const firstname = localStorage.getItem("firstname");

  return (
    <>
      <div className="container mt-4">
        <h2>Welcome {firstname ? firstname : "Student"} 👋</h2>
        <p className="text-muted">Start learning today</p>
      </div>

      <div className="main-content">
        <Sidebar />

        <div className="content">
          <h2>Student Dashboard</h2>
          <p>Announcements and Calendar will be here...</p>
        </div>
      </div>
    </>
  );
}

export default StudentDashboard;
