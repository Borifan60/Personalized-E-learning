import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";

function StudentCourses() {
  const [courses, setCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/courses")
      .then(res => res.json())
      .then(data => setCourses(data))
      .catch(err => console.error(err));

    fetch("http://localhost:8080/enrollments/my", { credentials: "include" })
      .then(res => {
        if (!res.ok) return "";
        return res.text();
      })
      .then(text => {
        if (!text) {
          setEnrolledCourses([]);
        } else {
          setEnrolledCourses(JSON.parse(text));
        }
      })
      .catch(() => setEnrolledCourses([]));

  }, []); // ✅ THIS WAS MISSING

  const handleEnroll = (courseId) => {
    Swal.fire({
      title: "Enroll Now?",
      text: "Do you want to enroll in this course?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Enroll",
    }).then(result => {
      if (result.isConfirmed) {
        fetch(`http://localhost:8080/enrollments/enroll/${courseId}`, {
          method: "POST",
          credentials: "include"
        })
          .then(res => res.text())
          .then(msg => {
            Swal.fire("Info", msg, "success");
            if (msg === "Successfully enrolled") {
              setEnrolledCourses(prev => [...prev, courseId]);
            }
          });
      }
    });
  };

  return (
    <div className="main-content d-flex">
      <Sidebar />

      <div className="container mt-4">
        <h2>Browse Courses</h2>
        <p className="text-muted">Choose a course and start learning</p>

        <div className="row mt-4">
          {courses.length > 0 ? (
            courses.map(course => (
              <div className="col-md-4 mb-4" key={course.courseId}>
                <div className="card shadow-sm h-100">
                  <div className="card-body">
                    <h5 className="card-title">{course.courseName}</h5>
                    <p className="card-text">
                      {course.description?.substring(0, 80)}...
                    </p>

                    <div className="d-flex justify-content-between">
                      <Link
                        to={`/student/view-course/${course.courseId}`}
                        className="btn btn-info btn-sm"
                      >
                        View
                      </Link>

                      {!enrolledCourses.includes(course.courseId) ? (
                        <button
                          onClick={() => handleEnroll(course.courseId)}
                          className="btn btn-success btn-sm"
                        >
                          Enroll
                        </button>
                      ) : (
                        <span className="text-success fw-bold">Enrolled</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <h4 className="text-center">No courses available</h4>
          )}
        </div>
      </div>
    </div>
  );
}

export default StudentCourses;
