import Header from "../components/Header";
import StudentSidebar from "../components/Student/Sidebar";
import Footer from "../components/Footer";

const StudentLayout = ({ children }) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />

      <div style={{ display: "flex", flex: 1 }}>
        <StudentSidebar />
        <div style={{ flex: 1, padding: "20px" }}>
          {children}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default StudentLayout;
