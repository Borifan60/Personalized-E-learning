import { useState } from "react";
import { Link } from "react-router-dom";

function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Sidebar styles
  const sidebarStyle = {
    width: isCollapsed ? "60px" : "250px",
    backgroundColor: "#1e3a8a",
    color: "white",
    height: "100vh", 
    position: "relative", // changed from fixed
    transition: "width 0.3s ease",
    overflow: "hidden",
    boxShadow: "2px 0 5px rgba(0,0,0,0.1)",
  };

  const hamburgerStyle = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "50px",
    cursor: "pointer",
    padding: "15px",
    borderBottom: "1px solid rgba(255,255,255,0.2)",
  };

  const lineStyle = {
    width: "25px",
    height: "3px",
    backgroundColor: "white", // ✅ Visible on dark blue
    margin: "3px 0",
    borderRadius: "2px",
    transition: "transform 0.3s ease, opacity 0.3s ease",
  };

  const line1Style = {
    ...lineStyle,
    transform: isCollapsed ? "rotate(45deg) translate(5px, 5px)" : "none",
  };

  const line2Style = {
    ...lineStyle,
    opacity: isCollapsed ? 0 : 1,
  };

  const line3Style = {
    ...lineStyle,
    transform: isCollapsed ? "rotate(-45deg) translate(7px, -6px)" : "none",
  };

  const ulStyle = {
    listStyle: "none",
    padding: "20px 0",
    margin: 0,
  };

  const liStyle = {
    padding: "15px 20px",
    transition: "background-color 0.3s",
    whiteSpace: "nowrap",
  };

  const linkStyle = {
    color: "white",
    textDecoration: "none",
    display: "flex",
    alignItems: "center",
    gap: "15px",
  };

  const iconStyle = {
    width: "20px",
    textAlign: "center",
    fontSize: "18px",
  };

  const textStyle = {
    opacity: isCollapsed ? 0 : 1,
    transition: "opacity 0.3s",
    overflow: "hidden",
  };

  return (
    <div style={sidebarStyle}>
      {/* Hamburger Menu */}
      <div style={hamburgerStyle} onClick={toggleSidebar}>
        <div style={line1Style}></div>
        <div style={line2Style}></div>
        <div style={line3Style}></div>
      </div>

      {/* Navigation Links */}
      <ul style={ulStyle}>
        <li style={liStyle}>
          <Link to="/student" style={linkStyle}>
            <i className="fas fa-home" style={iconStyle}></i>
            <span style={textStyle}>Dashboard</span>
          </Link>
        </li>
        <li style={liStyle}>
          <Link to="/student/course-list" style={linkStyle}>
            <i className="fas fa-book" style={iconStyle}></i>
            <span style={textStyle}>Course List</span>
          </Link>
        </li>
        <li style={liStyle}>
          <Link to="/student/my-courses" style={linkStyle}>
            <i className="fas fa-graduation-cap" style={iconStyle}></i>
            <span style={textStyle}>My Courses</span>
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
