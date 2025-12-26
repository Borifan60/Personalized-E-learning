import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Sidebar from "./Sidebar";
import ViewCourseById from "./ViewCourseById";

// Utility to extract filename from path
const getFileNameFromPath = (path) => {
  if (!path) return null;
  return path.split("\\").pop().split("/").pop();
};

function StudentLesson() {
  const { courseId } = useParams();
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!courseId) {
      setError("Invalid course ID.");
      setLoading(false);
      return;
    }

    const fetchLessons = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(
          `http://localhost:8080/lessons/course/${courseId}`,
          { withCredentials: true }
        );
        setLessons(res.data || []);
      } catch (err) {
        setError(
          err.response?.data?.message ||
          "Failed to load lessons. Please check your session or try again."
        );
        setLessons([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLessons();
  }, [courseId]);

  const viewPDF = (path) => {
    const fileName = getFileNameFromPath(path);
    if (fileName)
      window.open(`http://localhost:8080/files/pdf/${fileName}`, "_blank");
  };

  if (loading) return <div className="text-center mt-5">Loading lessons...</div>;
  if (error) return <div className="alert alert-danger text-center mt-5">{error}</div>;

  return (
    <div className="main-content d-flex">
      {/* ===== Embedded CSS ===== */}
      <style>{`
        .main-content {
          background: linear-gradient(135deg, #f8fafc, #eef2ff);
          min-height: 100vh;
        }

        .lesson-container {
          background: #ffffff;
          border-radius: 16px;
          padding: 25px 30px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.06);
        }

        .lesson-title {
          font-weight: 700;
          color: #1e293b;
          border-left: 5px solid #2563eb;
          padding-left: 12px;
          margin-bottom: 25px;
        }

        .lesson-card {
          border: none;
          border-radius: 16px;
          padding: 22px;
          background: linear-gradient(145deg, #ffffff, #f1f5f9);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }

        .lesson-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 14px 30px rgba(0, 0, 0, 0.12);
        }

        .lesson-card h5 {
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 10px;
        }

        .lesson-card p {
          color: #475569;
          font-size: 15px;
          line-height: 1.7;
        }

        video {
          border-radius: 12px;
          background: #000;
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.15);
        }

        .btn-primary {
          background: linear-gradient(135deg, #2563eb, #1e40af);
          border: none;
          border-radius: 30px;
          padding: 6px 18px;
          font-size: 14px;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .btn-primary:hover {
          background: linear-gradient(135deg, #1e40af, #1e3a8a);
          transform: scale(1.05);
          box-shadow: 0 8px 20px rgba(37, 99, 235, 0.4);
        }

        @media (max-width: 768px) {
          .lesson-container {
            padding: 18px;
          }
        }
      `}</style>

      <Sidebar />

      <div className="container mt-4 lesson-container">
        {/* Course Info */}
        <ViewCourseById courseId={courseId} />

        <h4 className="lesson-title">Lessons</h4>

        {lessons.length === 0 ? (
          <div className="alert alert-info">
            No lessons available for this course yet.
          </div>
        ) : (
          <div className="list-group">
            {lessons.map((lesson, index) => (
              <div
                className="list-group-item lesson-card mb-4"
                key={lesson.lessonId || index}
              >
                <h5>{lesson.lessonName || `Lesson #${index + 1}`}</h5>

                {lesson.lessonContent && (
                  <p>
                    {lesson.lessonContent.length > 150
                      ? `${lesson.lessonContent.substring(0, 150)}...`
                      : lesson.lessonContent}
                  </p>
                )}

                {lesson.videoPath && (
                  <div className="mt-3 ratio ratio-16x9" style={{ maxWidth: "600px" }}>
                    <video controls>
                      <source
                        src={`http://localhost:8080/files/video/${getFileNameFromPath(
                          lesson.videoPath
                        )}`}
                        type="video/mp4"
                      />
                    </video>
                  </div>
                )}

                {lesson.pdfPath && (
                  <div className="mt-3">
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => viewPDF(lesson.pdfPath)}
                    >
                      📄 View PDF
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default StudentLesson;
