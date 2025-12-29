import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Swal from "sweetalert2";

function StudentCourses() {
  const [allCourses, setAllCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch all courses
    const fetchAll = fetch("http://localhost:8080/courses").then(res => res.json());
    // Fetch enrolled courses
    const fetchEnrolled = fetch("http://localhost:8080/enrollments/my", { credentials: "include" })
      .then(res => res.json());

    Promise.all([fetchAll, fetchEnrolled])
      .then(([allData, enrolledData]) => {
        setAllCourses(allData);
        setEnrolledCourses(enrolledData);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleEnroll = (courseId) => {
    fetch(`http://localhost:8080/enrollments/enroll`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ courseId })
    })
      .then(res => res.json())
      .then(data => {
        Swal.fire("Success", "Successfully enrolled!", "success");
        setEnrolledCourses(prev => [...prev, { courseId }]); // Update enrolled courses
      })
      .catch(err => Swal.fire("Error", "Enrollment failed!", "error"));
  };

  if (loading) return <div className="text-center mt-5">Loading...</div>;

  // Filter out already enrolled courses
  const availableCourses = allCourses.filter(
    course => !enrolledCourses.some(ec => ec.courseId === course.courseId)
  );

  return (
    <div className="main-content d-flex">
      <Sidebar />
      <div className="container mt-4">
        <h2>Available Courses</h2>

        <div className="row">
          {availableCourses.length > 0 ? (
            availableCourses.map(course => (
              <div className="col-md-4 mb-4" key={course.courseId}>
                <div className="card h-100">
                  <div className="card-body">
                    <h5>{course.courseName}</h5>
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => handleEnroll(course.courseId)}
                    >
                      Enroll
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12">
              <div className="alert alert-info text-center">
                You are already enrolled in all available courses!
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default StudentCourses;
