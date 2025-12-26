import { Link } from "react-router-dom";

function Sidebar(){

return <div className="sidebar">
        
        <ul>
      <li><Link to="/admin"> <i className="fas fa-home"></i> Home</Link></li>
      <li><Link to="/signup"><i className="fas fa-plus"></i> Add User</Link></li>
      <li><Link to="/viewUser"><i className="fas fa-eye"></i> View Users</Link></li>
    </ul>
</div>
}
export default Sidebar