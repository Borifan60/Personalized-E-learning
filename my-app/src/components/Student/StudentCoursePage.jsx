import React from "react";
import { useParams, Link } from "react-router-dom";
import ViewCourseById from "./ViewCourseById";

function StudentCoursePage() {
  const { courseId } = useParams();

  return (
    <div className="container mt-4">
      {/* Display course details first */}
      <ViewCourseById courseId={courseId} />

      {/* Button to go to lessons */}
      <div className="mt-3">
        <Link
          to={`/student/lessons/${courseId}`}
          className="btn btn-success"
        >
          Start Learning
        </Link>
      </div>
    </div>
  );
}

export default StudentCoursePage;
