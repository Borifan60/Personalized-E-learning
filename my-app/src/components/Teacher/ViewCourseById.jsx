import React, { useEffect, useState } from "react";

function ViewCourseById({ id }) {
    const [course, setCourse] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:8080/courses/${id}`)
            .then((res) => res.json())
            .then((data) => setCourse(data))
            .catch((err) => console.error("Error fetching course:", err));
    }, [id]);

    if (!course) {
        return <p>Loading course details...</p>;
    }

    return (
        <div>
            <h5>Course Details</h5>
            <hr />

            <p><strong>Course ID:</strong> {course.courseId}</p>
            <p><strong>Course Name:</strong> {course.courseName}</p>
        </div>
    );
}

export default ViewCourseById;
