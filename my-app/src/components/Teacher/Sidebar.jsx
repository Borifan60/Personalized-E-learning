import { Link } from "react-router-dom";

function Sidebar(){

return <div className="sidebar">
      <ul>
      <li><Link to="/teacher"> <i className="fas fa-home"></i> Home</Link></li>
      <li><Link to="/create-course"> <i className="fas fa-plus"></i> Create Course</Link></li>
      <li><Link to="/view-course"> <i className="fas fa-eye"></i> View Courses</Link></li>
    </ul>
</div>
}
export default Sidebar