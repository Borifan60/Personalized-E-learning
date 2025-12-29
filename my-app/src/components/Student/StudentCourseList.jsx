import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Swal from "sweetalert2";
import "bootstrap/dist/css/bootstrap.min.css";

function StudentCourses() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [enrollingCourseId, setEnrollingCourseId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("Fetching courses and enrollments...");
    
    // Fetch all courses
    fetch("http://localhost:8080/courses")
      .then(res => {
        console.log("Courses response status:", res.status);
        if (!res.ok) {
          throw new Error(`Failed to fetch courses: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        console.log("Courses data:", data);
        setCourses(data);
        setError(null);
      })
      .catch(err => {
        console.error("Error fetching courses:", err);
        setCourses([]);
        setError("Failed to load courses. Please try again.");
      });

    // Fetch enrolled courses
    fetch("http://localhost:8080/enrollments/my", { 
      credentials: "include" 
    })
      .then(res => {
        console.log("Enrollments response status:", res.status);
        if (!res.ok) {
          if (res.status === 401) {
            // User not logged in - this is normal
            console.log("User not logged in, no enrollments");
            return [];
          }
          throw new Error(`Failed to fetch enrollments: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        console.log("Enrollments data:", data);
        if (Array.isArray(data)) {
          const courseIds = data.map(course => {
            if (typeof course === 'object' && course.courseId) {
              return course.courseId;
            } else if (typeof course === 'number') {
              return course;
            }
            return null;
          }).filter(id => id !== null);
          
          console.log("Parsed enrolled course IDs:", courseIds);
          setEnrolledCourses(courseIds);
        } else {
          console.log("Enrollments data is not an array");
          setEnrolledCourses([]);
        }
      })
      .catch(err => {
        console.error("Error fetching enrollments:", err);
        setEnrolledCourses([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleEnroll = (courseId, courseName) => {
    console.log("Enrolling in course:", courseId, courseName);
    
    Swal.fire({
      title: "Enroll Now?",
      text: `Do you want to enroll in "${courseName}"?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Enroll",
      cancelButtonText: "Cancel",
      showLoaderOnConfirm: true,
      allowOutsideClick: () => !Swal.isLoading(), // Prevent closing during loading
      preConfirm: () => {
        setEnrollingCourseId(courseId);
        return fetch(`http://localhost:8080/enrollments/enroll/${courseId}`, {
          method: "POST",
          credentials: "include"
        })
          .then(async (res) => {
            console.log("Enrollment response status:", res.status);
            const text = await res.text();
            console.log("Enrollment response text:", text);
            
            if (!res.ok) {
              let errorMsg = `Enrollment failed: ${res.status}`;
              try {
                const errorData = JSON.parse(text);
                errorMsg = errorData.message || errorMsg;
              } catch (e) {
                // Not JSON, use text as is
                if (text && text.trim()) {
                  errorMsg = text;
                }
              }
              throw new Error(errorMsg);
            }
            return text;
          })
          .catch(err => {
            console.error("Enrollment error:", err);
            Swal.showValidationMessage(`Enrollment failed: ${err.message}`);
            setEnrollingCourseId(null);
            return null;
          });
      }
    }).then(result => {
      setEnrollingCourseId(null);
      
      if (result.isConfirmed && result.value) {
        const msg = result.value;
        console.log("Enrollment successful, message:", msg);
        
        // Update enrolled courses list immediately
        setEnrolledCourses(prev => [...prev, courseId]);
        
        // Check if quiz already taken
        const quizTaken = localStorage.getItem(`quiz_score_${courseId}`);
        
        Swal.fire({
          title: "Successfully Enrolled! 🎉",
          html: `
            <div class="text-center">
              <div style="font-size: 48px; color: #4CAF50;">🎓</div>
              <h5>You're now enrolled in "${courseName}"</h5>
              <p class="text-muted mt-3">Complete a quick assessment to personalize your learning experience</p>
              ${quizTaken ? '<p class="text-success"><i class="fas fa-check-circle me-1"></i>You already have a quiz score for this course</p>' : ''}
            </div>
          `,
          icon: "success",
          showCancelButton: true,
          confirmButtonText: quizTaken ? "Retake Assessment Quiz" : "Take Assessment Quiz",
          cancelButtonText: "Go to Course",
          showDenyButton: true,
          denyButtonText: "Skip for Now",
          focusConfirm: false,
          allowEscapeKey: true,
          allowOutsideClick: true
        }).then((quizResult) => {
          if (quizResult.isConfirmed) {
            console.log("Taking quiz for course:", courseId);
            navigate(`/student/enrollment-quiz/${courseId}`, { 
              state: { 
                courseName: courseName,
                isRetake: !!quizTaken 
              } 
            });
          } else if (quizResult.isDenied) {
            console.log("Skipping quiz, going to course:", courseId);
            navigate(`/student/course/${courseId}`);
          } else if (quizResult.dismiss === Swal.DismissReason.cancel) {
            console.log("Going to course:", courseId);
            navigate(`/student/course/${courseId}`);
          }
        });
      }
    });
  };

  const goToCourse = (courseId) => {
    console.log("Navigating to course:", courseId);
    navigate(`/student/course/${courseId}`);
  };

  const goToQuiz = (courseId, courseName) => {
    console.log("Navigating to quiz for course:", courseId);
    const quizTaken = localStorage.getItem(`quiz_score_${courseId}`);
    navigate(`/student/enrollment-quiz/${courseId}`, { 
      state: { 
        courseName: courseName,
        isRetake: !!quizTaken 
      } 
    });
  };

  const refreshCourses = () => {
    setLoading(true);
    setError(null);
    
    fetch("http://localhost:8080/courses")
      .then(res => res.json())
      .then(data => {
        setCourses(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error refreshing courses:", err);
        setError("Failed to refresh courses");
        setLoading(false);
      });
  };

  if (loading) {
    return (
      <div className="main-content d-flex">
        <Sidebar />
        <div className="container mt-4 text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="main-content d-flex">
      <Sidebar />

      <div className="container mt-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2>Browse Courses</h2>
            <p className="text-muted">Choose a course and start learning</p>
          </div>
          <button 
            onClick={refreshCourses} 
            className="btn btn-outline-secondary btn-sm"
            title="Refresh courses"
          >
            <i className="fas fa-sync-alt me-1"></i>
            Refresh
          </button>
        </div>
        
        {/* Error Message */}
        {error && (
          <div className="alert alert-danger">
            <i className="fas fa-exclamation-triangle me-2"></i>
            {error}
            <button 
              onClick={refreshCourses} 
              className="btn btn-sm btn-outline-danger ms-3"
            >
              Retry
            </button>
          </div>
        )}
        
        {/* Debug Info - Remove in production */}
        {process.env.NODE_ENV === 'development' && (
          <div className="alert alert-secondary small mb-3">
            <strong>Debug Info:</strong> Found {courses.length} courses, 
            Enrolled in {enrolledCourses.length} courses
            <button 
              className="btn btn-sm btn-outline-secondary ms-2"
              onClick={() => {
                console.log("Courses:", courses);
                console.log("Enrolled:", enrolledCourses);
              }}
            >
              Log Data
            </button>
          </div>
        )}
        
        {/* Personalized Learning Banner */}
        <div className="alert alert-info d-flex align-items-center mb-4">
          <i className="fas fa-graduation-cap fa-2x me-3"></i>
          <div className="flex-grow-1">
            <h5 className="mb-1">Personalized Learning Experience</h5>
            <p className="mb-0">
              Take a quick assessment after enrollment to get lessons tailored to your skill level
            </p>
          </div>
          <i className="fas fa-chevron-right"></i>
        </div>

        {courses.length === 0 ? (
          <div className="text-center py-5">
            <i className="fas fa-book-open fa-3x text-muted mb-3"></i>
            <h4>No courses available</h4>
            <p className="text-muted">Check back later for new courses</p>
            <button onClick={refreshCourses} className="btn btn-primary mt-2">
              <i className="fas fa-sync-alt me-2"></i>
              Refresh
            </button>
          </div>
        ) : (
          <div className="row">
            {courses.map(course => {
              const isEnrolled = enrolledCourses.includes(course.courseId);
              const isEnrolling = enrollingCourseId === course.courseId;
              const quizTaken = localStorage.getItem(`quiz_score_${course.courseId}`);
              
              return (
                <div className="col-md-4 mb-4" key={course.courseId}>
                  <div className="card shadow-sm h-100 hover-shadow">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <h5 className="card-title mb-0 text-truncate" title={course.courseName}>
                          {course.courseName}
                        </h5>
                        {isEnrolled && (
                          <span className="badge bg-success">
                            <i className="fas fa-check me-1"></i>
                            Enrolled
                            {quizTaken && (
                              <span className="ms-1">
                                <i className="fas fa-star" style={{fontSize: '0.7em'}}></i>
                              </span>
                            )}
                          </span>
                        )}
                      </div>
                      
                      <p className="card-text text-muted" style={{minHeight: '48px'}}>
                        {course.description?.substring(0, 80) || "No description available."}
                        {course.description?.length > 80 && "..."}
                      </p>
                      
                      <div className="mt-3 small text-muted">
                        <div className="d-flex align-items-center mb-1">
                          <i className="fas fa-user-graduate me-2"></i>
                          <span>Personalized learning path</span>
                        </div>
                        <div className="d-flex align-items-center mb-1">
                          <i className="fas fa-chart-line me-2"></i>
                          <span>Adaptive recommendations</span>
                        </div>
                        <div className="d-flex align-items-center">
                          <i className="fas fa-tasks me-2"></i>
                          <span>Skill-based assessment</span>
                        </div>
                      </div>
                    </div>

                    <div className="card-footer bg-transparent pt-3">
                      <div className="d-flex justify-content-between align-items-center">
                        {/* VIEW BUTTON → MODAL */}
                        <button
                          className="btn btn-outline-info btn-sm"
                          data-bs-toggle="modal"
                          data-bs-target="#courseModal"
                          onClick={() => setSelectedCourse(course)}
                        >
                          <i className="fas fa-eye me-1"></i>
                          Details
                        </button>

                        {!isEnrolled ? (
                          <button
                            onClick={() => handleEnroll(course.courseId, course.courseName)}
                            className="btn btn-success btn-sm px-3"
                            disabled={isEnrolling}
                          >
                            {isEnrolling ? (
                              <>
                                <span className="spinner-border spinner-border-sm me-1"></span>
                                Enrolling...
                              </>
                            ) : (
                              <>
                                <i className="fas fa-user-plus me-1"></i>
                                Enroll
                              </>
                            )}
                          </button>
                        ) : (
                          <div className="d-flex gap-2">
                            <button
                              onClick={() => goToQuiz(course.courseId, course.courseName)}
                              className="btn btn-warning btn-sm"
                              title={quizTaken ? "Retake assessment quiz" : "Take assessment quiz"}
                            >
                              <i className="fas fa-clipboard-check me-1"></i>
                              {quizTaken ? "Retake Quiz" : "Quiz"}
                            </button>
                            <button
                              onClick={() => goToCourse(course.courseId)}
                              className="btn btn-primary btn-sm"
                            >
                              <i className="fas fa-play me-1"></i>
                              Learn
                            </button>
                          </div>
                        )}
                      </div>
                      
                      {isEnrolled && quizTaken && (
                        <div className="mt-2 text-center">
                          <small className="text-success">
                            <i className="fas fa-star me-1"></i>
                            Quiz score: {localStorage.getItem(`quiz_score_${course.courseId}`)}/100
                          </small>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* COURSE DETAILS MODAL */}
      <div
        className="modal fade"
        id="courseModal"
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header bg-primary text-white">
              <h5 className="modal-title">
                <i className="fas fa-info-circle me-2"></i>
                Course Information
              </h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>

            <div className="modal-body">
              {selectedCourse && (
                <>
                  <div className="mb-3">
                    <h6 className="text-muted">Course Name</h6>
                    <h5>{selectedCourse.courseName}</h5>
                  </div>
                  
                  <div className="mb-3">
                    <h6 className="text-muted">Description</h6>
                    <p className="lead">{selectedCourse.description || "No description available."}</p>
                  </div>
                  
                  <div className="mb-3">
                    <h6 className="text-muted">Personalized Learning Features</h6>
                    <ul className="list-unstyled">
                      <li className="mb-2">
                        <i className="fas fa-check text-success me-2"></i>
                        <strong>Skill assessment quiz</strong> - Determine your starting level
                      </li>
                      <li className="mb-2">
                        <i className="fas fa-check text-success me-2"></i>
                        <strong>Difficulty-based recommendations</strong> - Lessons match your skill
                      </li>
                      <li className="mb-2">
                        <i className="fas fa-check text-success me-2"></i>
                        <strong>Adaptive learning path</strong> - Adjusts as you progress
                      </li>
                      <li>
                        <i className="fas fa-check text-success me-2"></i>
                        <strong>Progress tracking</strong> - Visualize your learning journey
                      </li>
                    </ul>
                  </div>
                  
                  <div className="alert alert-info">
                    <i className="fas fa-lightbulb me-2"></i>
                    After enrollment, you'll take a quick assessment to personalize your learning experience.
                  </div>
                </>
              )}
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              
              {selectedCourse && !enrolledCourses.includes(selectedCourse.courseId) && (
                <button
                  type="button"
                  className="btn btn-primary"
                  data-bs-dismiss="modal"
                  onClick={() => handleEnroll(selectedCourse.courseId, selectedCourse.courseName)}
                >
                  <i className="fas fa-user-plus me-1"></i>
                  Enroll Now
                </button>
              )}
              
              {selectedCourse && enrolledCourses.includes(selectedCourse.courseId) && (
                <div className="d-flex gap-2">
                  <button
                    type="button"
                    className="btn btn-warning"
                    data-bs-dismiss="modal"
                    onClick={() => goToQuiz(selectedCourse.courseId, selectedCourse.courseName)}
                  >
                    <i className="fas fa-clipboard-check me-1"></i>
                    {localStorage.getItem(`quiz_score_${selectedCourse.courseId}`) ? "Retake Quiz" : "Take Quiz"}
                  </button>
                  <button
                    type="button"
                    className="btn btn-success"
                    data-bs-dismiss="modal"
                    onClick={() => goToCourse(selectedCourse.courseId)}
                  >
                    <i className="fas fa-play me-1"></i>
                    Go to Course
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentCourses;