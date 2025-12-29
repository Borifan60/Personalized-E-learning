import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import LessonSidebar from "./LessonSidebar";
import "./StudentLesson.css"; // We'll create this CSS file

function StudentLesson() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  
  // State
  const [lessons, setLessons] = useState([]);
  const [activeLesson, setActiveLesson] = useState(null);
  const [completedLessonIds, setCompletedLessonIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [completing, setCompleting] = useState(false);
  const [learnerLevel, setLearnerLevel] = useState("beginner");
  const [showAll, setShowAll] = useState(false);
  const [personalizedData, setPersonalizedData] = useState(null);
  const [progress, setProgress] = useState(0);

  // Fetch lessons
  useEffect(() => {
    if (!courseId) {
      setError("No course ID provided");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        console.log("📡 Fetching lessons for course:", courseId);
        
        // Try adaptive endpoint
        try {
          const adaptiveRes = await axios.get(
            `http://localhost:8080/lessons/personalized/${courseId}`,
            { 
              withCredentials: true,
              timeout: 10000
            }
          );
          
          console.log("✅ Adaptive lessons response:", adaptiveRes.data);
          
          if (adaptiveRes.data && !adaptiveRes.data.error) {
            setPersonalizedData(adaptiveRes.data);
            setLearnerLevel(adaptiveRes.data.learnerLevel || "beginner");
            
            // Combine all lessons
            const allLessons = [
              ...(adaptiveRes.data.beginnerLessons || []),
              ...(adaptiveRes.data.intermediateLessons || []),
              ...(adaptiveRes.data.advancedLessons || [])
            ];
            
            console.log("📚 Total lessons found:", allLessons.length);
            
            if (allLessons.length > 0) {
              setLessons(allLessons);
              if (!activeLesson) {
                setActiveLesson(allLessons[0]);
              }
            } else {
              throw new Error("No lessons found in adaptive response");
            }
          } else {
            throw new Error(adaptiveRes.data?.error || "Invalid response from server");
          }
          
        } catch (adaptiveError) {
          console.log("⚠️ Adaptive endpoint failed, trying regular endpoint:", adaptiveError.message);
          
          // Fallback to regular endpoint
          const regularRes = await axios.get(
            `http://localhost:8080/lessons/course/${courseId}`,
            { 
              withCredentials: true,
              timeout: 10000
            }
          );
          
          console.log("📡 Regular lessons response:", regularRes.data);
          
          if (regularRes.data && Array.isArray(regularRes.data) && regularRes.data.length > 0) {
            setLessons(regularRes.data);
            if (!activeLesson) {
              setActiveLesson(regularRes.data[0]);
            }
            setPersonalizedData(null);
          } else {
            setError("No lessons available for this course yet.");
          }
        }

        // Fetch completed lessons
        try {
          const completedRes = await axios.get(
            "http://localhost:8080/activity/completed/my",
            { 
              withCredentials: true,
              timeout: 5000
            }
          );
          setCompletedLessonIds(completedRes.data || []);
          
          // Calculate progress
          if (lessons.length > 0) {
            const completedCount = completedRes.data?.length || 0;
            const progressPercent = Math.round((completedCount / lessons.length) * 100);
            setProgress(progressPercent);
          }
        } catch (e) {
          console.log("ℹ️ Could not fetch completed lessons:", e.message);
        }

      } catch (err) {
        console.error("❌ Error fetching lessons:", err);
        
        let errorMessage = "Failed to load lessons. ";
        if (err.response) {
          if (err.response.status === 401) {
            errorMessage = "Please log in to access lessons.";
            setTimeout(() => navigate("/login"), 2000);
          } else if (err.response.status === 404) {
            errorMessage = "Course or lessons not found.";
          } else {
            errorMessage += `Server error: ${err.response.status}`;
          }
        } else if (err.request) {
          errorMessage = "Cannot connect to server. Please check your connection.";
        } else {
          errorMessage = err.message || "An unexpected error occurred.";
        }
        
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [courseId, navigate]);

  // Helper function to extract YouTube ID
  const extractYouTubeId = (url) => {
    if (!url) return null;
    try {
      const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
      const match = url.match(regExp);
      return (match && match[7]?.length === 11) ? match[7] : null;
    } catch (e) {
      return null;
    }
  };

  // Mark lesson as completed
  const handleMarkAsCompleted = async () => {
    if (!activeLesson || completing) return;
    
    setCompleting(true);
    try {
      await axios.post(
        `http://localhost:8080/activity/complete/${activeLesson.lessonId}`,
        null,
        { withCredentials: true }
      );
      
      // Add to completed list
      const newCompletedIds = [...completedLessonIds, activeLesson.lessonId];
      setCompletedLessonIds(newCompletedIds);
      
      // Update progress
      const newProgress = Math.round((newCompletedIds.length / lessons.length) * 100);
      setProgress(newProgress);
      
      // Show success toast
      const toast = document.createElement('div');
      toast.className = 'completion-toast show';
      toast.innerHTML = `
        <div class="toast-content">
          <i class="fas fa-check-circle"></i>
          <div>
            <strong>Lesson Completed!</strong>
            <p>"${activeLesson.lessonName}" marked as complete</p>
          </div>
        </div>
      `;
      document.body.appendChild(toast);
      
      setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
      }, 3000);
      
    } catch (error) {
      console.error("❌ Error completing lesson:", error);
      
      // Show error toast
      const toast = document.createElement('div');
      toast.className = 'error-toast show';
      toast.innerHTML = `
        <div class="toast-content">
          <i class="fas fa-exclamation-circle"></i>
          <div>
            <strong>Error</strong>
            <p>Failed to mark lesson as completed</p>
          </div>
        </div>
      `;
      document.body.appendChild(toast);
      
      setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
      }, 3000);
    } finally {
      setCompleting(false);
    }
  };

  // Filter lessons based on learner level and showAll flag
  const getFilteredLessons = () => {
    if (showAll) return lessons;
    
    if (personalizedData?.recommendedLessons) {
      return personalizedData.recommendedLessons;
    }
    
    return lessons.filter(lesson => {
      const difficulty = lesson.difficultyLevel?.toLowerCase() || "beginner";
      
      switch(learnerLevel.toLowerCase()) {
        case "beginner":
          return difficulty === "beginner";
        case "intermediate":
          return difficulty === "beginner" || difficulty === "intermediate";
        case "advanced":
          return true;
        default:
          return difficulty === "beginner";
      }
    });
  };

  // Get level color
  const getLevelColor = (level) => {
    switch(level?.toLowerCase()) {
      case 'beginner': return { bg: '#dbeafe', text: '#1d4ed8', border: '#93c5fd' };
      case 'intermediate': return { bg: '#fef3c7', text: '#92400e', border: '#fde68a' };
      case 'advanced': return { bg: '#dcfce7', text: '#166534', border: '#86efac' };
      default: return { bg: '#e5e7eb', text: '#374151', border: '#d1d5db' };
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="lesson-loading-container">
        <div className="loading-animation">
          <div className="loader"></div>
          <div className="loading-text">
            <h3>Loading Your Learning Journey</h3>
            <p>Preparing personalized lessons...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="lesson-error-container">
        <div className="error-content">
          <div className="error-icon">
            <i className="fas fa-book-open"></i>
          </div>
          <h2>Unable to Load Lessons</h2>
          <p className="error-message">{error}</p>
          <div className="error-actions">
            <button 
              className="btn btn-primary"
              onClick={() => window.location.reload()}
            >
              <i className="fas fa-redo me-2"></i>
              Try Again
            </button>
            <button 
              className="btn btn-outline-secondary"
              onClick={() => navigate('/student/courses')}
            >
              <i className="fas fa-arrow-left me-2"></i>
              Back to Courses
            </button>
          </div>
        </div>
      </div>
    );
  }

  const filteredLessons = getFilteredLessons();
  const completedCount = completedLessonIds.length;
  const totalLessons = lessons.length;
  const levelColors = getLevelColor(learnerLevel);

  return (
    <div className="student-lesson-container">
      {/* Header with Progress */}
      <div className="lesson-header">
        <div className="container">
          <div className="header-content">
            <div className="header-main">
              <h1>
                <i className="fas fa-graduation-cap me-3"></i>
                Learning Center
              </h1>
              <p className="header-subtitle">
                {personalizedData ? "Personalized Learning Experience" : "Course Materials"}
              </p>
            </div>
            
            <div className="header-stats">
              <div className="progress-card">
                <div className="progress-info">
                  <span className="progress-label">Your Progress</span>
                  <span className="progress-percent">{progress}%</span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <div className="progress-count">
                  {completedCount} of {totalLessons} lessons completed
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-fluid lesson-main-container">
        <div className="row">
          {/* Sidebar */}
          <div className="col-lg-3 col-xl-2 lesson-sidebar-container">
            <div className="sidebar-wrapper">
              <LessonSidebar
                lessons={filteredLessons}
                activeLessonId={activeLesson?.lessonId}
                completedLessonIds={completedLessonIds}
                onSelectLesson={(lesson) => {
                  setActiveLesson(lesson);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                learnerLevel={learnerLevel}
                showAll={showAll}
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="col-lg-9 col-xl-10 lesson-content-container">
            {/* Control Bar */}
            <div className="control-bar">
              <div className="control-left">
                <div className="learner-badge" style={{ 
                  backgroundColor: levelColors.bg,
                  color: levelColors.text,
                  borderColor: levelColors.border
                }}>
                  <i className="fas fa-user-graduate me-2"></i>
                  {learnerLevel.toUpperCase()} LEARNER
                </div>
                
                <div className="view-toggle">
                  <span className="toggle-label">
                    <i className="fas fa-filter me-2"></i>
                    View:
                  </span>
                  <button
                    onClick={() => setShowAll(false)}
                    className={`toggle-btn ${!showAll ? 'active' : ''}`}
                  >
                    <i className="fas fa-bullseye me-1"></i>
                    Personalized
                  </button>
                  <button
                    onClick={() => setShowAll(true)}
                    className={`toggle-btn ${showAll ? 'active' : ''}`}
                  >
                    <i className="fas fa-globe me-1"></i>
                    All Lessons
                  </button>
                </div>
              </div>
              
              <div className="lesson-count">
                <span className="count-current">{filteredLessons.length}</span>
                <span className="count-separator">/</span>
                <span className="count-total">{totalLessons}</span>
                <span className="count-label"> lessons</span>
              </div>
            </div>

            {/* Lesson Content */}
            {!activeLesson ? (
              <div className="empty-lesson-state">
                <div className="empty-icon">
                  <i className="fas fa-book-open"></i>
                </div>
                <h3>Welcome to Your Learning Journey</h3>
                <p className="empty-message">
                  Select a lesson from the sidebar to begin learning. 
                  Your personalized path is ready for you!
                </p>
                <div className="empty-stats">
                  {personalizedData && (
                    <div className="stats-grid">
                      <div className="stat-card beginner">
                        <div className="stat-icon">
                          <i className="fas fa-seedling"></i>
                        </div>
                        <div className="stat-content">
                          <div className="stat-count">{personalizedData.beginnerCount || 0}</div>
                          <div className="stat-label">Beginner</div>
                        </div>
                      </div>
                      <div className="stat-card intermediate">
                        <div className="stat-icon">
                          <i className="fas fa-chart-line"></i>
                        </div>
                        <div className="stat-content">
                          <div className="stat-count">{personalizedData.intermediateCount || 0}</div>
                          <div className="stat-label">Intermediate</div>
                        </div>
                      </div>
                      <div className="stat-card advanced">
                        <div className="stat-icon">
                          <i className="fas fa-rocket"></i>
                        </div>
                        <div className="stat-content">
                          <div className="stat-count">{personalizedData.advancedCount || 0}</div>
                          <div className="stat-label">Advanced</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="lesson-content-card">
                {/* Lesson Header */}
                <div className="lesson-header-card">
                  <div className="lesson-title-section">
                    <div className="lesson-breadcrumb">
                      <span className="breadcrumb-item">Lessons</span>
                      <i className="fas fa-chevron-right mx-2"></i>
                      <span className="breadcrumb-item active">{activeLesson.lessonName}</span>
                    </div>
                    
                    <h2 className="lesson-title">
                      {activeLesson.lessonName}
                      {activeLesson.difficultyLevel && (
                        <span 
                          className="difficulty-badge"
                          style={{ 
                            backgroundColor: getLevelColor(activeLesson.difficultyLevel).bg,
                            color: getLevelColor(activeLesson.difficultyLevel).text,
                            borderColor: getLevelColor(activeLesson.difficultyLevel).border
                          }}
                        >
                          <i className="fas fa-chart-bar me-1"></i>
                          {activeLesson.difficultyLevel.toUpperCase()}
                        </span>
                      )}
                    </h2>
                    
                    <div className="lesson-meta">
                      <span className="meta-item">
                        <i className="fas fa-clock me-1"></i>
                        Lesson {lessons.findIndex(l => l.lessonId === activeLesson.lessonId) + 1} of {lessons.length}
                      </span>
                      {completedLessonIds.includes(activeLesson.lessonId) && (
                        <span className="meta-item completed">
                          <i className="fas fa-check-circle me-1"></i>
                          Completed
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Lesson Content */}
                <div className="lesson-content-wrapper">
                  {/* Text Content */}
                  {activeLesson.lessonContent && (
                    <div className="content-section">
                      <div className="section-header">
                        <i className="fas fa-file-alt section-icon"></i>
                        <h3>Lesson Content</h3>
                      </div>
                      <div className="content-text">
                        {activeLesson.lessonContent.split('\n').map((paragraph, index) => (
                          paragraph.trim() && (
                            <p key={index} className="content-paragraph">
                              {paragraph}
                            </p>
                          )
                        ))}
                      </div>
                    </div>
                  )}

                  {/* YouTube Video */}
                  {activeLesson.videoSource === 'youtube' && activeLesson.youtubeLink && (
                    <div className="content-section">
                      <div className="section-header">
                        <i className="fas fa-play-circle section-icon video-icon"></i>
                        <h3>Video Lesson</h3>
                      </div>
                      <div className="video-container">
                        <div className="video-wrapper">
                          <iframe
                            src={`https://www.youtube.com/embed/${extractYouTubeId(activeLesson.youtubeLink)}`}
                            title="YouTube video player"
                            allowFullScreen
                            className="video-iframe"
                          ></iframe>
                        </div>
                        <div className="video-info">
                          <i className="fas fa-info-circle me-2"></i>
                          Watch this video to reinforce your understanding of the lesson
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Uploaded Video */}
                  {activeLesson.videoSource === 'upload' && activeLesson.videoPath && (
                    <div className="content-section">
                      <div className="section-header">
                        <i className="fas fa-film section-icon video-icon"></i>
                        <h3>Video Material</h3>
                      </div>
                      <div className="video-container">
                        <video 
                          controls 
                          className="custom-video-player"
                        >
                          <source
                            src={`http://localhost:8080/${activeLesson.videoPath}`}
                            type="video/mp4"
                          />
                          Your browser does not support the video tag.
                        </video>
                      </div>
                    </div>
                  )}

                  {/* PDF */}
                  {activeLesson.pdfPath && (
                    <div className="content-section">
                      <div className="section-header">
                        <i className="fas fa-file-pdf section-icon pdf-icon"></i>
                        <h3>PDF Material</h3>
                      </div>
                      <div className="pdf-container">
                        <div className="pdf-preview">
                          <div className="pdf-icon-large">
                            <i className="fas fa-file-pdf"></i>
                          </div>
                          <div className="pdf-info">
                            <h4>Downloadable Resource</h4>
                            <p>This PDF contains additional materials and exercises</p>
                          </div>
                        </div>
                        <a
                          href={`http://localhost:8080/${activeLesson.pdfPath}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="pdf-download-btn"
                        >
                          <i className="fas fa-download me-2"></i>
                          Download PDF
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Completion Section */}
                  <div className="completion-section">
                    <div className="completion-card">
                      <div className="completion-content">
                        <div className="completion-icon">
                          {completedLessonIds.includes(activeLesson.lessonId) ? (
                            <i className="fas fa-trophy"></i>
                          ) : (
                            <i className="fas fa-flag-checkered"></i>
                          )}
                        </div>
                        <div className="completion-text">
                          <h4>
                            {completedLessonIds.includes(activeLesson.lessonId) 
                              ? "Lesson Completed! 🎉" 
                              : "Ready to Complete This Lesson?"}
                          </h4>
                          <p>
                            {completedLessonIds.includes(activeLesson.lessonId)
                              ? "Great job! You've successfully completed this lesson."
                              : "Mark this lesson as complete when you've finished studying the material."}
                          </p>
                        </div>
                      </div>
                      
                      <button
                        onClick={handleMarkAsCompleted}
                        disabled={completing || completedLessonIds.includes(activeLesson.lessonId)}
                        className={`completion-btn ${
                          completedLessonIds.includes(activeLesson.lessonId) ? 'completed' : ''
                        } ${completing ? 'loading' : ''}`}
                      >
                        {completing ? (
                          <>
                            <span className="spinner"></span>
                            Marking...
                          </>
                        ) : completedLessonIds.includes(activeLesson.lessonId) ? (
                          <>
                            <i className="fas fa-check me-2"></i>
                            Lesson Completed
                          </>
                        ) : (
                          <>
                            <i className="fas fa-check-circle me-2"></i>
                            Mark as Complete
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Navigation */}
                  <div className="lesson-navigation">
                    <button
                      className="nav-btn prev-btn"
                      onClick={() => {
                        const currentIndex = lessons.findIndex(l => l.lessonId === activeLesson.lessonId);
                        if (currentIndex > 0) {
                          setActiveLesson(lessons[currentIndex - 1]);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }
                      }}
                      disabled={lessons.findIndex(l => l.lessonId === activeLesson.lessonId) === 0}
                    >
                      <i className="fas fa-arrow-left me-2"></i>
                      Previous Lesson
                    </button>
                    
                    <div className="nav-progress">
                      <span className="nav-current">{lessons.findIndex(l => l.lessonId === activeLesson.lessonId) + 1}</span>
                      <span className="nav-separator">of</span>
                      <span className="nav-total">{lessons.length}</span>
                    </div>
                    
                    <button
                      className="nav-btn next-btn"
                      onClick={() => {
                        const currentIndex = lessons.findIndex(l => l.lessonId === activeLesson.lessonId);
                        if (currentIndex < lessons.length - 1) {
                          setActiveLesson(lessons[currentIndex + 1]);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }
                      }}
                      disabled={lessons.findIndex(l => l.lessonId === activeLesson.lessonId) === lessons.length - 1}
                    >
                      Next Lesson
                      <i className="fas fa-arrow-right ms-2"></i>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create CSS file with these styles */}
      <style jsx>{`
        /* Add these styles to your StudentLesson.css file */
      `}</style>
    </div>
  );
}

export default StudentLesson;