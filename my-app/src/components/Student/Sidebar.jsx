import { Link } from "react-router-dom";

function Sidebar(){

return <div className="sidebar">
        <h2>Student</h2>
        <hr></hr>
        <ul>
      <li><Link to="/student"> <i className="fas fa-home"></i> Home</Link></li>
      <li><Link to="/student/course-list"> <i className="fas fa-book"></i> Course List</Link></li>
      <li><Link to="/student/my-courses"> <i className="fas fa-graduation-cap"></i> My Courses</Link></li>
    </ul>
</div>
}
export default Sidebar