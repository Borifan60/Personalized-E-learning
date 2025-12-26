import { useParams } from "react-router-dom";

function StudentLesson() {
  const { courseId } = useParams();

  return (
    <div>
      <h2>Course Lessons</h2>
      <p>Course ID: {courseId}</p>
      {/* fetch lessons by courseId */}
    </div>
  );
}

export default StudentLesson;
