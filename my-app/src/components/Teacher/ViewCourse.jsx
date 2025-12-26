import Swal from "sweetalert2";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import Sidebar from "./Sidebar";
import ViewCourseById from "./ViewCourseById";

function ViewCourse() {
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState(null);

  // Fetch all courses
  useEffect(() => {
    fetch("http://localhost:8080/courses")
      .then((res) => res.json())
      .then((data) => setCourses(data))
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  // Delete course with SweetAlert
  const handleDelete = (courseId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This course will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Delete",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`http://localhost:8080/courses/${courseId}`, {
          method: "DELETE",
        })
          .then((res) => {
            if (!res.ok) throw new Error("Delete failed");

            setCourses((prev) =>
              prev.filter((c) => c.courseId !== courseId)
            );

            Swal.fire("Deleted!", "Course has been deleted.", "success");
          })
          .catch(() => {
            Swal.fire("Error!", "Could not delete course.", "error");
          });
      }
    });
  };

  return (
    <div className="main-content d-flex">
      <Sidebar />

      <div className="content container mt-4">
        <h2 className="mb-4">Registered Courses</h2>

        <div className="mb-3">
          <Link to="/create-course" className="btn btn-primary">
            Create New Course
          </Link>
        </div>

        <table className="table table-bordered table-striped">
          <thead className="table-dark">
            <tr>
              <th width="15%">Course ID</th>
              <th>Course Name</th>
              <th width="40%" className="text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {courses.length > 0 ? (
              courses.map((course) => (
                <tr key={course.courseId}>
                  <td>{course.courseId}</td>
                  <td>{course.courseName}</td>
                  <td className="text-center">
                    <div className="d-flex justify-content-center gap-2 flex-wrap">

                      <button
                        className="btn btn-sm btn-info"
                        data-bs-toggle="modal"
                        data-bs-target="#viewCourseModal"
                        onClick={() => setSelectedCourseId(course.courseId)}
                      >
                        View
                      </button>

                      <Link
                        to={`/editCourse/${course.courseId}`}
                        className="btn btn-sm btn-warning"
                      >
                        Edit
                      </Link>

                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(course.courseId)}
                      >
                        Delete
                      </button>

                      <Link
                        to={`/create-lesson/${course.courseId}`}
                        className="btn btn-sm btn-success"
                      >
                        Add Lesson
                      </Link>

                      <Link
                        to={`/course/${course.courseId}/lessons`}
                        className="btn btn-sm btn-primary"
                      >
                        View Lessons
                      </Link>

                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center py-4">
                  <h5>No Courses Found</h5>
                  <p className="text-muted">
                    Create your first course to get started.
                  </p>
                  <Link to="/create-course" className="btn btn-primary">
                    Create Course
                  </Link>
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Course Details Modal */}
        <div
          className="modal fade"
          id="viewCourseModal"
          tabIndex="-1"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Course Details</h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                ></button>
              </div>
              <div className="modal-body">
                {selectedCourseId && (
                  <ViewCourseById id={selectedCourseId} />
                )}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default ViewCourse;
