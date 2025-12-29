import Header from "../components/Header";
import AdminSidebar from "../components/Admin/Sidebar";
import Footer from "../components/Footer";

const AdminLayout = ({ children }) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />

      <div style={{ display: "flex", flex: 1 }}>
        <AdminSidebar />
        <div style={{ flex: 1, padding: "20px" }}>
          {children}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AdminLayout;
