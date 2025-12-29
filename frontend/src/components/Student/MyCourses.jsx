import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function MyCourses() {
  const navigate = useNavigate();
  const [courseDetails, setCourseDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        console.log("Fetching enrolled courses...");
        const response = await axios.get("http://localhost:8080/enrollments/my", {
          withCredentials: true,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });
        
        console.log("API Response Data:", response.data);
        console.log("Response Type:", typeof response.data);
        console.log("Is Array?", Array.isArray(response.data));
        
        if (response.data && Array.isArray(response.data)) {
          console.log("First item:", response.data[0]);
          
          // Transform the data based on what we receive
          const courses = response.data.map(item => {
            // CASE 1: DTO object with courseId and courseName
            if (item.courseId !== undefined || item.course_id !== undefined) {
              return {
                courseId: item.courseId || item.course_id,
                courseName: item.courseName || item.course_name || `Course ${item.courseId || item.course_id}`
              };
            }
            // CASE 2: Just a number (course ID)
            else if (typeof item === 'number') {
              return {
                courseId: item,
                courseName: `Course ${item}`
              };
            }
            // CASE 3: Object with id and name
            else if (item.id !== undefined) {
              return {
                courseId: item.id,
                courseName: item.name || item.courseName || `Course ${item.id}`
              };
            }
            // CASE 4: Unknown structure
            else {
              console.warn("Unknown item structure:", item);
              return null;
            }
          }).filter(course => course !== null); // Remove null items
          
          console.log("Transformed courses:", courses);
          setCourseDetails(courses);
        } else {
          console.error("Invalid response format:", response.data);
          setError("Invalid data received from server");
          setCourseDetails([]);
        }
        
      } catch (error) {
        console.error("Error fetching enrollments:", error);
        if (error.response) {
          console.error("Response status:", error.response.status);
          console.error("Response data:", error.response.data);
          setError(`Server error: ${error.response.status} - ${error.response.data.message || 'Unknown error'}`);
        } else if (error.request) {
          setError("No response from server. Check if backend is running.");
        } else {
          setError(`Error: ${error.message}`);
        }
        setCourseDetails([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEnrolledCourses();
  }, []);

  // Loading state
  if (loading) {
    return (
      <>
        <div className="main-content d-flex">
          <Sidebar />
          <div className="container mt-4 text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading your courses...</p>
          </div>
        </div>
      </>
    );
  }

  // Error state
  if (error) {
    return (
      <>
        <div className="main-content d-flex">
          <Sidebar />
          <div className="container mt-4">
            <div className="alert alert-danger">
              <h5><i className="fas fa-exclamation-triangle me-2"></i>Error Loading Courses</h5>
              <p>{error}</p>
              <div className="mt-3">
                <button 
                  onClick={() => window.location.reload()}
                  className="btn btn-outline-danger me-2"
                >
                  <i className="fas fa-redo me-1"></i>Retry
                </button>
                <button 
                  onClick={() => navigate('/student/courses')}
                  className="btn btn-primary"
                >
                  <i className="fas fa-search me-1"></i>Browse Courses
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Success state
  return (
    <>
      <div className="main-content d-flex">
        <Sidebar />
        <div className="container mt-4">
          <h2>My Courses</h2>
          <p className="text-muted">
            {courseDetails.length} enrolled course{courseDetails.length !== 1 ? 's' : ''}
          </p>

          <div className="row">
            {courseDetails.length > 0 ? (
              courseDetails.map((course, index) => {
                // Validate courseId is a number
                const courseId = course.courseId;
                const isValidId = courseId !== null && courseId !== undefined && 
                                 !isNaN(courseId) && 
                                 typeof courseId === 'number';
                
                return (
                  <div 
                    className="col-md-4 mb-4" 
                    key={isValidId ? `course-${courseId}` : `course-temp-${index}`}
                  >
                    <div className="card h-100 shadow-sm">
                      <div className="card-body d-flex flex-column">
                        <h5 className="card-title">
                          {course.courseName || `Course ${courseId || 'Unknown'}`}
                        </h5>
                        
                        {/* Debug info in development */}
                        {process.env.NODE_ENV === 'development' && (
                          <div className="mb-2">
                            <small className={`badge ${isValidId ? 'bg-success' : 'bg-danger'}`}>
                              {isValidId ? `Valid ID: ${courseId}` : 'Invalid ID'}
                            </small>
                            <small className="text-muted d-block mt-1">
                              Type: {typeof courseId}
                            </small>
                          </div>
                        )}
                        
                        <div className="mt-auto">
                          <div className="d-flex justify-content-between align-items-center">
                            <span className="text-muted small">
                              ID: {courseId || 'N/A'}
                            </span>
                            
                            {isValidId ? (
                              <Link
                                to={`/student/lessons/${courseId}`}
                                className="btn btn-primary btn-sm"
                              >
                                <i className="fas fa-play me-1"></i>
                                Start Learning
                              </Link>
                            ) : (
                              <button
                                className="btn btn-secondary btn-sm"
                                disabled
                                title="This course cannot be loaded due to invalid ID"
                              >
                                <i className="fas fa-exclamation-triangle me-1"></i>
                                Unavailable
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-12">
                <div className="alert alert-warning">
                  <div className="text-center py-4">
                    <i className="fas fa-book-open fa-3x text-muted mb-3"></i>
                    <h4>No enrolled courses yet</h4>
                    <p className="text-muted">
                      Browse available courses and enroll to start learning
                    </p>
                    <button 
                      onClick={() => navigate('/student/courses')}
                      className="btn btn-primary mt-2"
                    >
                      <i className="fas fa-search me-2"></i>
                      Browse Courses
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default MyCourses;