import React, { useEffect, useState } from "react";

function ViewCourseById({ courseId }) {
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!courseId) {
      setError("Invalid course ID");
      setLoading(false);
      return;
    }

    fetch(`http://localhost:8080/courses/${courseId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Course not found");
        return res.json();
      })
      .then((data) => setCourse(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [courseId]);

  if (loading) return <p>Loading course details...</p>;
  if (error) return <p className="text-danger">Error: {error}</p>;
  if (!course) return <p>No course data available.</p>;

  return (
    <div className="mb-4">
      <h4>Course Details</h4>
      <hr />
      <p><strong>Course ID:</strong> {course.courseId}</p>
      <p><strong>Course Name:</strong> {course.courseName}</p>
      {course.courseDescription && <p><strong>Description:</strong> {course.courseDescription}</p>}
    </div>
  );
}

export default ViewCourseById;
