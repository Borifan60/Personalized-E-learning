import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import { Link } from "react-router-dom";

function Header() {
  return (
    <div className="header d-flex justify-content-between align-items-center p-3 shadow-sm">

      {/* Logo */}
      <div className="logo"><b>Dalell</b></div>

      {/* Title */}
      <div className="title">
        <h1>E-LEARNING</h1>
      </div>

      {/* Settings Dropdown */}
      <div className="user-profile dropdown">
        <button
          className="btn btn-light dropdown-toggle"
          type="button"
          id="settingsDropdown"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <i className="fas fa-gear"></i>
        </button>

        <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="settingsDropdown">
          <li>
            <Link className="dropdown-item" to="/change-profile">
              Change Profile
            </Link>
          </li>
          <li>
            <Link className="dropdown-item text-danger" to="/logout">
              Logout       &nbsp; <i class="fa-solid fa-right-from-bracket"></i>

            </Link>
          </li>
        </ul>
      </div>

    </div>
  );
}

export default Header;
