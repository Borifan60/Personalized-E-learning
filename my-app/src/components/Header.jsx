import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import { Link } from "react-router-dom";

function Header() {
    const firstname = localStorage.getItem("firstname");

    // Styles
    const headerStyle = {
        backgroundColor: "#ffffff",
        padding: "16px 40px",
        borderBottom: "1px solid #e2e8f0",
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.04)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        position: "sticky",
        top: "0",
        zIndex: "1000",
        fontFamily: "'Segoe UI', 'Inter', -apple-system, sans-serif"
    };

    const logoStyle = {
        fontSize: "26px",
        fontWeight: "800",
        color: "#3b82f6",
        letterSpacing: "-0.5px",
        background: "linear-gradient(90deg, #3b82f6 0%, #1d4ed8 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text"
    };

    const titleStyle = {
        fontSize: "22px",
        fontWeight: "700",
        color: "#1e293b",
        margin: "0"
    };

    const welcomeStyle = {
        fontSize: "16px",
        fontWeight: "500",
        color: "#475569",
        display: "flex",
        alignItems: "center",
        gap: "8px"
    };

    const dropdownButtonStyle = {
        backgroundColor: "#f8fafc",
        border: "1px solid #e2e8f0",
        borderRadius: "8px",
        padding: "10px 14px",
        color: "#64748b",
        transition: "all 0.2s ease",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    };

    const dropdownItemStyle = {
        padding: "10px 20px",
        fontSize: "14px",
        fontWeight: "500",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        color: "#475569",
        textDecoration: "none",
        transition: "all 0.2s ease"
    };

    const logoutItemStyle = {
        color: "#dc2626",
        padding: "10px 20px",
        fontSize: "14px",
        fontWeight: "500",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        textDecoration: "none",
        transition: "all 0.2s ease"
    };

    return (
        <div style={headerStyle} className="header">

            {/* Logo */}
            <div style={logoStyle} className="logo">
                <b>AASTU</b>
            </div>

            {/* Title */}
            <div className="title">
                <h1 style={titleStyle}>E-LEARNING SYSTEM</h1>
            </div>

            {/* Welcome Message */}
            <div style={welcomeStyle}>
                <span>👋</span>
                <span>Welcome, <b style={{ color: "#3b82f6" }}>{firstname ? firstname : "Student"}</b></span>
            </div>

            {/* Settings Dropdown */}
            <div className="user-profile dropdown">
                <button
                    className="btn"
                    type="button"
                    id="settingsDropdown"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    style={dropdownButtonStyle}
                    onMouseOver={(e) => {
                        e.target.style.backgroundColor = "#f1f5f9";
                        e.target.style.color = "#3b82f6";
                        e.target.style.borderColor = "#cbd5e1";
                    }}
                    onMouseOut={(e) => {
                        e.target.style.backgroundColor = "#f8fafc";
                        e.target.style.color = "#64748b";
                        e.target.style.borderColor = "#e2e8f0";
                    }}
                >
                    <i className="fas fa-gear" style={{ fontSize: "18px" }}></i>
                </button>

                <ul 
                    className="dropdown-menu dropdown-menu-end" 
                    aria-labelledby="settingsDropdown"
                    style={{
                        border: "1px solid #e2e8f0",
                        borderRadius: "10px",
                        boxShadow: "0 10px 25px rgba(0, 0, 0, 0.08)",
                        padding: "8px 0",
                        minWidth: "200px"
                    }}
                >
                    <li>
                        <Link 
                            className="dropdown-item" 
                            to="/change-profile"
                            style={dropdownItemStyle}
                            onMouseOver={(e) => {
                                e.target.style.backgroundColor = "#f1f5f9";
                                e.target.style.color = "#3b82f6";
                                e.target.style.paddingLeft = "25px";
                            }}
                            onMouseOut={(e) => {
                                e.target.style.backgroundColor = "transparent";
                                e.target.style.color = "#475569";
                                e.target.style.paddingLeft = "20px";
                            }}
                        >
                            <span>👤 Change Profile</span>
                            <i className="fas fa-chevron-right" style={{ fontSize: "12px", color: "#94a3b8" }}></i>
                        </Link>
                    </li>
                    <li>
                        <hr className="dropdown-divider" style={{ margin: "8px 0", color: "#e2e8f0" }} />
                    </li>
                    <li>
                        <Link 
                            className="dropdown-item" 
                            to="/logout"
                            style={logoutItemStyle}
                            onMouseOver={(e) => {
                                e.target.style.backgroundColor = "#fee2e2";
                                e.target.style.color = "#b91c1c";
                                e.target.style.paddingLeft = "25px";
                            }}
                            onMouseOut={(e) => {
                                e.target.style.backgroundColor = "transparent";
                                e.target.style.color = "#dc2626";
                                e.target.style.paddingLeft = "20px";
                            }}
                        >
                            <span>🚪 Logout</span>
                            <i className="fa-solid fa-right-from-bracket" style={{ fontSize: "14px" }}></i>
                        </Link>
                    </li>
                </ul>
            </div>

        </div>
    );
}

export default Header;