import { Link } from "react-router-dom";

function Index() {
  const navStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#1e3a8a",
    padding: "15px 25px",
    borderRadius: "10px",
    color: "white",
    marginBottom: "20px",
  };

  const titleStyle = {
    fontSize: "24px",
    fontWeight: "700",
  };

  const ulStyle = {
    listStyle: "none",
    display: "flex",
    gap: "20px",
    margin: 0,
    padding: 0,
  };

  const linkStyle = {
    color: "white",
    textDecoration: "none",
    fontWeight: "500",
  };

  return (
    <header>
      <nav style={navStyle}>
        <div style={titleStyle}>E-Learning System</div>

        <ul style={ulStyle}>
          {/* ✅ HOME MUST BE "/" */}
          <li>
            <Link to="/" style={linkStyle}>Home</Link>
          </li>
          <li>
            <Link to="/about" style={linkStyle}>About Us</Link>
          </li>
          <li>
            <Link to="/contact" style={linkStyle}>Contact Us</Link>
          </li>
          <li>
            <Link to="/login" style={linkStyle}>Login</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Index;
