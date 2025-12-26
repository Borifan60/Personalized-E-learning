import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { Link } from "react-router-dom";

function MyCourses() {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8080/enrollments/my", { credentials: "include" })
      .then(res => res.json())
      .then(data => setEnrolledCourses(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center mt-5">Loading...</div>;

  return (
    <div className="main-content d-flex">
      <Sidebar />
      <div className="container mt-4">
        <h2>My Courses</h2>

        <div className="row">
          {enrolledCourses.length > 0 ? (
            enrolledCourses.map(course => (
              <div className="col-md-4 mb-4" key={course.courseId}>
                <div className="card h-100">
                  <div className="card-body">
                    <h5>{course.courseName}</h5>
                    <Link
                      to={`/student/course/${course.courseId}`} // Updated link
                      className="btn btn-primary btn-sm"
                    >
                      View Course
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12">
              <div className="alert alert-warning text-center">
                You have not enrolled in any courses yet.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MyCourses;
