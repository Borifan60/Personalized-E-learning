import { Link, useLocation } from "react-router-dom";

function Index() {
  const location = useLocation();
  
  const navStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#ffffff",
    padding: "20px 50px",
    color: "#333333",
    marginBottom: "30px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.05)",
    borderBottom: "2px solid #f0f0f0"
  };

  const titleStyle = {
    fontSize: "26px",
    fontWeight: "700",
    color: "#2c3e50",
    letterSpacing: "-0.5px",
    display: "flex",
    alignItems: "center",
    gap: "12px"
  };

  const ulStyle = {
    listStyle: "none",
    display: "flex",
    gap: "35px",
    margin: 0,
    padding: 0,
  };

  const linkStyle = (path) => ({
    color: location.pathname === path ? "#3498db" : "#555555",
    textDecoration: "none",
    fontWeight: "600",
    fontSize: "16px",
    padding: "8px 0",
    transition: "all 0.2s ease",
    position: "relative",
    display: "flex",
    alignItems: "center",
    gap: "8px"
  });

  const activeIndicator = {
    position: "absolute",
    bottom: "-8px",
    left: 0,
    width: "100%",
    height: "3px",
    backgroundColor: "#3498db"
  };

  return (
    <header>
      <nav style={navStyle}>
        <div style={titleStyle}>
          <span style={{ color: "#3498db", fontSize: "28px" }}>📚</span>
          <span>E-Learning System</span>
        </div>

        <ul style={ulStyle}>
          <li style={{ position: "relative" }}>
            <Link 
              to="/" 
              style={linkStyle("/")}
              onMouseOver={(e) => e.target.style.color = "#2980b9"}
              onMouseOut={(e) => e.target.style.color = location.pathname === "/" ? "#3498db" : "#555555"}
            >
              <span>🏠</span> Home
            </Link>
            {location.pathname === "/" && <div style={activeIndicator} />}
          </li>
          <li style={{ position: "relative" }}>
            <Link 
              to="/about" 
              style={linkStyle("/about")}
              onMouseOver={(e) => e.target.style.color = "#2980b9"}
              onMouseOut={(e) => e.target.style.color = location.pathname === "/about" ? "#3498db" : "#555555"}
            >
              <span>ℹ️</span> About Us
            </Link>
            {location.pathname === "/about" && <div style={activeIndicator} />}
          </li>
          <li style={{ position: "relative" }}>
            <Link 
              to="/contact" 
              style={linkStyle("/contact")}
              onMouseOver={(e) => e.target.style.color = "#2980b9"}
              onMouseOut={(e) => e.target.style.color = location.pathname === "/contact" ? "#3498db" : "#555555"}
            >
              <span>📞</span> Contact Us
            </Link>
            {location.pathname === "/contact" && <div style={activeIndicator} />}
          </li>
          <li style={{ position: "relative" }}>
            <Link 
              to="/login" 
              style={linkStyle("/login")}
              onMouseOver={(e) => e.target.style.color = "#2980b9"}
              onMouseOut={(e) => e.target.style.color = location.pathname === "/login" ? "#3498db" : "#555555"}
            >
              <span>🔐</span> Login
            </Link>
            {location.pathname === "/login" && <div style={activeIndicator} />}
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Index;