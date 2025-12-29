import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import LessonSidebar from "./LessonSidebar";
import StudentNav from "./StudentNav";
import Chatbot from "./Chatbot";

function StudentLesson() {
  const { courseId } = useParams();
  
  // Styles at the top
  const loadingStyle = { 
    display: "flex", 
    flexDirection: "column", 
    alignItems: "center", 
    justifyContent: "center", 
    minHeight: "400px", 
    fontSize: "18px", 
    color: "#64748b" 
  };
  
  const errorStyle = { 
    backgroundColor: "#fee2e2", 
    color: "#dc2626", 
    padding: "20px", 
    borderRadius: "8px", 
    textAlign: "center", 
    margin: "40px auto", 
    maxWidth: "500px", 
    fontSize: "16px" 
  };

  // State
  const [lessons, setLessons] = useState([]);
  const [activeLesson, setActiveLesson] = useState(null);
  const [completedLessonIds, setCompletedLessonIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [completing, setCompleting] = useState(false);
  const [learnerLevel, setLearnerLevel] = useState("beginner");
  const [showAll, setShowAll] = useState(false);
  
  // Quiz States
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizLoading, setQuizLoading] = useState(false);
  const [userAnswers, setUserAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(null);
  const [showQuizResults, setShowQuizResults] = useState(false);
  const [quizDifficulty, setQuizDifficulty] = useState("adaptive");

  // Fetch data
  useEffect(() => {
    if (!courseId) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        console.log("Fetching data for course:", courseId);
        
        // OPTION 1: Try adaptive endpoint first
        try {
          const adaptiveRes = await axios.get(
            `http://localhost:8080/lessons/personalized/${courseId}`,
            { withCredentials: true }
          );
          
          console.log("Adaptive response:", adaptiveRes.data);
          
          setLearnerLevel(adaptiveRes.data.learnerLevel || "beginner");
          
          // Combine all lessons from all difficulty levels
          const allLessons = [
            ...(adaptiveRes.data.beginnerLessons || []),
            ...(adaptiveRes.data.intermediateLessons || []),
            ...(adaptiveRes.data.advancedLessons || [])
          ];
          
          console.log("Combined lessons:", allLessons.length);
          
          if (allLessons.length > 0) {
            setLessons(allLessons);
            if (!activeLesson) {
              setActiveLesson(allLessons[0]);
            }
          } else {
            // If no lessons from adaptive, try regular endpoint
            throw new Error("No lessons from adaptive endpoint");
          }
          
        } catch (adaptiveError) {
          console.log("Adaptive endpoint failed, trying regular endpoint");
          
          // OPTION 2: Fallback to regular endpoint
          const regularRes = await axios.get(
            `http://localhost:8080/lessons/course/${courseId}`,
            { withCredentials: true }
          );
          
          console.log("Regular response lessons:", regularRes.data?.length || 0);
          
          if (regularRes.data && regularRes.data.length > 0) {
            setLessons(regularRes.data);
            if (!activeLesson) {
              setActiveLesson(regularRes.data[0]);
            }
          } else {
            setError("No lessons found for this course");
          }
        }

        // Get completed lessons
        try {
          const completedRes = await axios.get(
            "http://localhost:8080/activity/completed/my",
            { withCredentials: true }
          );
          setCompletedLessonIds(completedRes.data || []);
        } catch (e) {
          console.log("Completed lessons not available");
        }

      } catch (err) {
        console.error("Error:", err);
        setError(err.message || "Failed to load lessons");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [courseId]);

  // Reset quiz when lesson changes
  useEffect(() => {
    if (activeLesson) {
      setShowQuiz(false);
      setQuizQuestions([]);
      setUserAnswers({});
      setQuizSubmitted(false);
      setQuizScore(null);
      setShowQuizResults(false);
    }
  }, [activeLesson?.lessonId]);

  // Helper functions
  const extractYouTubeId = (url) => {
    if (!url) return null;
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : null;
  };

  const handleMarkAsCompleted = async () => {
    if (!activeLesson || completing) return;
    
    setCompleting(true);
    try {
      await axios.post(
        `http://localhost:8080/activity/complete/${activeLesson.lessonId}`,
        null,
        { withCredentials: true }
      );
      setCompletedLessonIds([...completedLessonIds, activeLesson.lessonId]);
    } catch (error) {
      console.error(error);
    } finally {
      setCompleting(false);
    }
  };

  // Quiz Functions
  const generateQuiz = async () => {
    if (!activeLesson) return;
    
    setQuizLoading(true);
    try {
      const response = await axios.post(
        `http://localhost:8080/api/quiz/generate/${activeLesson.lessonId}`,
        {
          numberOfQuestions: 5,
          difficulty: quizDifficulty,
          includeExplanation: true
        },
        { withCredentials: true }
      );
      
      setQuizQuestions(response.data.questions || []);
      setShowQuiz(true);
      setUserAnswers({});
      setQuizSubmitted(false);
      setQuizScore(null);
      setShowQuizResults(false);
    } catch (error) {
      console.error("Error generating quiz:", error);
      alert("Failed to generate quiz. Please try again.");
    } finally {
      setQuizLoading(false);
    }
  };

  const handleAnswerSelect = (questionIndex, answerIndex) => {
    setUserAnswers({
      ...userAnswers,
      [questionIndex]: answerIndex
    });
  };

  const submitQuiz = async () => {
    if (!activeLesson || quizSubmitted) return;
    
    setQuizLoading(true);
    try {
      const response = await axios.post(
        `http://localhost:8080/api/quiz/submit/${activeLesson.lessonId}`,
        {
          quiz: quizQuestions,
          answers: userAnswers
        },
        { withCredentials: true }
      );
      
      setQuizScore(response.data);
      setQuizSubmitted(true);
      setShowQuizResults(true);
      
      // If score is high enough, auto-complete the lesson
      if (response.data.score >= 80 && !completedLessonIds.includes(activeLesson.lessonId)) {
        setTimeout(() => {
          handleMarkAsCompleted();
        }, 1000);
      }
    } catch (error) {
      console.error("Error submitting quiz:", error);
      alert("Failed to submit quiz. Please try again.");
    } finally {
      setQuizLoading(false);
    }
  };

  const retakeQuiz = () => {
    setUserAnswers({});
    setQuizSubmitted(false);
    setQuizScore(null);
    setShowQuizResults(false);
  };

  const closeQuiz = () => {
    setShowQuiz(false);
    setQuizQuestions([]);
    setUserAnswers({});
    setQuizSubmitted(false);
    setQuizScore(null);
    setShowQuizResults(false);
  };

  // Calculate quiz progress
  const calculateQuizProgress = () => {
    const answered = Object.keys(userAnswers).length;
    const total = quizQuestions.length;
    return total > 0 ? (answered / total) * 100 : 0;
  };

  // Filter lessons based on learner level
  const getFilteredLessons = () => {
    if (showAll) return lessons;
    
    return lessons.filter(lesson => {
      const difficulty = lesson.difficultyLevel?.toLowerCase() || "beginner";
      
      switch(learnerLevel.toLowerCase()) {
        case "beginner":
          return difficulty === "beginner";
        case "intermediate":
          return difficulty === "beginner" || difficulty === "intermediate";
        case "advanced":
          return true; // All lessons
        default:
          return difficulty === "beginner";
      }
    });
  };

  // Render Quiz Component
  const renderQuiz = () => {
    if (!showQuiz || !activeLesson) return null;

    return (
      <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "20px"
      }}>
        <div style={{
          backgroundColor: "white",
          borderRadius: "12px",
          padding: "30px",
          maxWidth: "800px",
          width: "100%",
          maxHeight: "90vh",
          overflow: "auto",
          position: "relative"
        }}>
          {/* Header */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px"
          }}>
            <div>
              <h2 style={{ margin: 0, color: "#1e293b" }}>
                🎯 Quiz: {activeLesson.lessonName}
              </h2>
              <p style={{ margin: "5px 0 0 0", color: "#64748b" }}>
                Test your understanding of this lesson
              </p>
            </div>
            <button
              onClick={closeQuiz}
              style={{
                background: "none",
                border: "none",
                fontSize: "24px",
                cursor: "pointer",
                color: "#64748b"
              }}
            >
              ✕
            </button>
          </div>

          {/* Progress Bar */}
          <div style={{ marginBottom: "25px" }}>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "5px"
            }}>
              <span>Progress</span>
              <span>{Object.keys(userAnswers).length}/{quizQuestions.length} answered</span>
            </div>
            <div style={{
              height: "8px",
              backgroundColor: "#e2e8f0",
              borderRadius: "4px",
              overflow: "hidden"
            }}>
              <div style={{
                width: `${calculateQuizProgress()}%`,
                height: "100%",
                backgroundColor: "#3b82f6",
                transition: "width 0.3s ease"
              }} />
            </div>
          </div>

          {/* Quiz Questions */}
          {quizLoading ? (
            <div style={loadingStyle}>
              <div style={{
                width: "40px",
                height: "40px",
                border: "3px solid #e2e8f0",
                borderTop: "3px solid #3b82f6",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
                marginBottom: "20px"
              }} />
              Generating quiz questions...
            </div>
          ) : (
            <>
              {quizQuestions.map((question, qIndex) => (
                <div key={qIndex} style={{
                  marginBottom: "30px",
                  padding: "20px",
                  backgroundColor: "#f8fafc",
                  borderRadius: "8px",
                  border: showQuizResults && userAnswers[qIndex] !== question.correctAnswer 
                    ? "2px solid #ef4444" 
                    : showQuizResults && userAnswers[qIndex] === question.correctAnswer
                    ? "2px solid #10b981"
                    : "1px solid #e2e8f0"
                }}>
                  <h4 style={{ margin: "0 0 15px 0", color: "#1e293b" }}>
                    {qIndex + 1}. {question.question}
                  </h4>
                  
                  <div style={{ marginBottom: "15px" }}>
                    {question.options.map((option, oIndex) => {
                      let optionStyle = {
                        display: "block",
                        width: "100%",
                        textAlign: "left",
                        padding: "12px 15px",
                        marginBottom: "10px",
                        borderRadius: "8px",
                        border: "1px solid #e2e8f0",
                        backgroundColor: "white",
                        cursor: quizSubmitted ? "default" : "pointer",
                        transition: "all 0.2s"
                      };

                      // Apply styles based on quiz state
                      if (showQuizResults) {
                        if (oIndex === question.correctAnswer) {
                          optionStyle.backgroundColor = "#d1fae5";
                          optionStyle.borderColor = "#10b981";
                          optionStyle.color = "#065f46";
                        } else if (userAnswers[qIndex] === oIndex && oIndex !== question.correctAnswer) {
                          optionStyle.backgroundColor = "#fee2e2";
                          optionStyle.borderColor = "#ef4444";
                          optionStyle.color = "#991b1b";
                        }
                      } else if (userAnswers[qIndex] === oIndex) {
                        optionStyle.backgroundColor = "#dbeafe";
                        optionStyle.borderColor = "#3b82f6";
                        optionStyle.color = "#1e40af";
                      }

                      return (
                        <button
                          key={oIndex}
                          style={optionStyle}
                          onClick={() => !quizSubmitted && handleAnswerSelect(qIndex, oIndex)}
                          disabled={quizSubmitted}
                        >
                          <div style={{ display: "flex", alignItems: "center" }}>
                            <div style={{
                              width: "20px",
                              height: "20px",
                              borderRadius: "50%",
                              border: "2px solid #94a3b8",
                              marginRight: "10px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "12px"
                            }}>
                              {String.fromCharCode(65 + oIndex)}
                            </div>
                            {option}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Explanation (shown after submission) */}
                  {showQuizResults && question.explanation && (
                    <div style={{
                      padding: "15px",
                      backgroundColor: "#f0f9ff",
                      borderRadius: "8px",
                      borderLeft: "4px solid #0ea5e9",
                      marginTop: "15px"
                    }}>
                      <strong style={{ color: "#0369a1" }}>💡 Explanation:</strong>
                      <p style={{ margin: "8px 0 0 0", color: "#475569" }}>
                        {question.explanation}
                      </p>
                    </div>
                  )}
                </div>
              ))}

              {/* Action Buttons */}
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "30px",
                paddingTop: "20px",
                borderTop: "1px solid #e2e8f0"
              }}>
                {!quizSubmitted ? (
                  <>
                    <button
                      onClick={closeQuiz}
                      style={{
                        padding: "10px 20px",
                        backgroundColor: "#f1f5f9",
                        color: "#64748b",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontWeight: "500"
                      }}
                    >
                      Cancel Quiz
                    </button>
                    <button
                      onClick={submitQuiz}
                      disabled={Object.keys(userAnswers).length !== quizQuestions.length}
                      style={{
                        padding: "10px 30px",
                        backgroundColor: Object.keys(userAnswers).length === quizQuestions.length ? "#10b981" : "#94a3b8",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        cursor: Object.keys(userAnswers).length === quizQuestions.length ? "pointer" : "not-allowed",
                        fontWeight: "600",
                        fontSize: "16px"
                      }}
                    >
                      Submit Quiz
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={retakeQuiz}
                      style={{
                        padding: "10px 20px",
                        backgroundColor: "#3b82f6",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontWeight: "500"
                      }}
                    >
                      Retake Quiz
                    </button>
                    <button
                      onClick={closeQuiz}
                      style={{
                        padding: "10px 30px",
                        backgroundColor: "#10b981",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontWeight: "600",
                        fontSize: "16px"
                      }}
                    >
                      Continue Learning
                    </button>
                  </>
                )}
              </div>

              {/* Quiz Results */}
              {quizScore && (
                <div style={{
                  marginTop: "30px",
                  padding: "25px",
                  backgroundColor: "#f0fdf4",
                  borderRadius: "12px",
                  textAlign: "center",
                  border: "2px solid #86efac"
                }}>
                  <div style={{ fontSize: "48px", marginBottom: "15px" }}>
                    {quizScore.score >= 80 ? "🎉" : quizScore.score >= 60 ? "👍" : "💪"}
                  </div>
                  <h3 style={{ margin: "0 0 10px 0", color: "#065f46" }}>
                    Quiz Completed!
                  </h3>
                  <div style={{
                    fontSize: "42px",
                    fontWeight: "700",
                    color: quizScore.score >= 80 ? "#10b981" : quizScore.score >= 60 ? "#f59e0b" : "#ef4444",
                    margin: "15px 0"
                  }}>
                    {quizScore.score}%
                  </div>
                  <p style={{ color: "#475569", marginBottom: "15px" }}>
                    You answered <strong>{quizScore.correctAnswers}</strong> out of <strong>{quizScore.totalQuestions}</strong> questions correctly
                  </p>
                  <p style={{ color: "#059669", fontWeight: "500" }}>
                    {quizScore.message}
                  </p>
                  {quizScore.score >= 80 && !completedLessonIds.includes(activeLesson.lessonId) && (
                    <p style={{ color: "#047857", marginTop: "15px", fontSize: "14px" }}>
                      ✅ Lesson marked as completed!
                    </p>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    );
  };

  // Render
  if (loading) return (
    <div style={loadingStyle}>
      <div style={{
        width: "50px",
        height: "50px",
        border: "3px solid #e2e8f0",
        borderTop: "3px solid #3b82f6",
        borderRadius: "50%",
        animation: "spin 1s linear infinite",
        marginBottom: "20px"
      }} />
      <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      Loading lessons...
    </div>
  );

  if (error) return (
    <div style={errorStyle}>
      <div style={{ fontSize: "24px", marginBottom: "10px" }}>⚠️</div>
      {error}
      <button 
        onClick={() => window.location.reload()}
        style={{ marginTop: "15px", padding: "8px 16px" }}
      >
        Retry
      </button>
    </div>
  );

  const filteredLessons = getFilteredLessons();

  return (
    <>
      <StudentNav courseId={courseId} />

      <div style={{ display: "flex", minHeight: "calc(100vh - 80px)", backgroundColor: "#f8fafc" }}>
        <LessonSidebar
          lessons={filteredLessons}
          activeLessonId={activeLesson?.lessonId}
          completedLessonIds={completedLessonIds}
          onSelectLesson={(lesson) => {
            console.log("Selecting lesson:", lesson.lessonName);
            setActiveLesson(lesson);
          }}
        />

        <div style={{ flex: 1, padding: "30px 40px", maxWidth: "1200px", margin: "0 auto" }}>
          {/* Header */}
          <div style={{
            backgroundColor: "white",
            borderRadius: "12px",
            padding: "20px",
            marginBottom: "25px",
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.05)"
          }}>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "15px"
            }}>
              <div>
                <h3 style={{ margin: 0, color: "#1e293b" }}>
                  {showAll ? "All Lessons" : "Adaptive Learning"}
                </h3>
                <p style={{ margin: "5px 0 0 0", color: "#64748b", fontSize: "14px" }}>
                  {showAll 
                    ? `Showing all ${lessons.length} lessons` 
                    : `Showing ${filteredLessons.length} of ${lessons.length} lessons for ${learnerLevel} learners`}
                </p>
              </div>
              
              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <div style={{
                  padding: "8px 16px",
                  backgroundColor: 
                    learnerLevel === "beginner" ? "#dbeafe" :
                    learnerLevel === "intermediate" ? "#fef3c7" : "#dcfce7",
                  borderRadius: "20px",
                  fontWeight: "600",
                  color: 
                    learnerLevel === "beginner" ? "#1d4ed8" :
                    learnerLevel === "intermediate" ? "#92400e" : "#166534"
                }}>
                  {learnerLevel.toUpperCase()} LEARNER
                </div>
                
                <button
                  onClick={() => setShowAll(!showAll)}
                  style={{
                    padding: "8px 16px",
                    backgroundColor: showAll ? "#e2e8f0" : "#3b82f6",
                    color: showAll ? "#64748b" : "white",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: "500"
                  }}
                >
                  {showAll ? "🎯 Personalized" : "🌐 View All"}
                </button>
              </div>
            </div>
            
            {filteredLessons.length === 0 && !showAll && (
              <div style={{
                backgroundColor: "#fef3c7",
                border: "1px solid #fde68a",
                borderRadius: "8px",
                padding: "15px",
                color: "#92400e",
                marginTop: "10px"
              }}>
                <p style={{ margin: 0 }}>
                  <strong>No lessons available for your level.</strong> 
                  {lessons.length > 0 ? " Try 'View All' to see all lessons." : ""}
                </p>
              </div>
            )}
          </div>

          {/* Lesson Content */}
          {!activeLesson ? (
            <div style={{
              backgroundColor: "#f1f5f9",
              padding: "40px",
              borderRadius: "12px",
              textAlign: "center",
              color: "#64748b"
            }}>
              <div style={{ fontSize: "48px", marginBottom: "20px" }}>📚</div>
              <p style={{ fontSize: "18px", fontWeight: "500", marginBottom: "10px" }}>
                Select a lesson to view its content
              </p>
            </div>
          ) : (
            <div style={{
              backgroundColor: "#ffffff",
              borderRadius: "12px",
              padding: "30px",
              boxShadow: "0 2px 10px rgba(0, 0, 0, 0.05)",
              position: "relative"
            }}>
              {/* Lesson Header with Quiz Button */}
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: "20px"
              }}>
                <div style={{ flex: 1 }}>
                  <h1 style={{ 
                    fontSize: "28px", 
                    fontWeight: "700", 
                    color: "#1e293b",
                    marginBottom: "10px"
                  }}>
                    {activeLesson.lessonName}
                    {activeLesson.difficultyLevel && (
                      <span style={{
                        display: "inline-flex",
                        alignItems: "center",
                        padding: "4px 12px",
                        borderRadius: "20px",
                        fontSize: "13px",
                        fontWeight: "500",
                        marginLeft: "15px",
                        backgroundColor: 
                          activeLesson.difficultyLevel === 'beginner' ? "#dbeafe" :
                          activeLesson.difficultyLevel === 'intermediate' ? "#fef3c7" : "#fce7f3",
                        color: 
                          activeLesson.difficultyLevel === 'beginner' ? "#1d4ed8" :
                          activeLesson.difficultyLevel === 'intermediate' ? "#92400e" : "#be185d"
                      }}>
                        {activeLesson.difficultyLevel.toUpperCase()}
                      </span>
                    )}
                  </h1>
                  <p style={{ color: "#64748b", fontSize: "15px" }}>
                    Complete this lesson to advance your learning
                  </p>
                </div>
                
                <button
                  onClick={generateQuiz}
                  disabled={quizLoading}
                  style={{
                    backgroundColor: "#8b5cf6",
                    color: "white",
                    border: "none",
                    padding: "12px 24px",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontWeight: "600",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    boxShadow: "0 4px 6px rgba(139, 92, 246, 0.2)"
                  }}
                >
                  {quizLoading ? (
                    <>
                      <div style={{
                        width: "16px",
                        height: "16px",
                        border: "2px solid rgba(255,255,255,0.3)",
                        borderTop: "2px solid white",
                        borderRadius: "50%",
                        animation: "spin 1s linear infinite"
                      }} />
                      Generating...
                    </>
                  ) : (
                    <>
                      <span>🎯</span> Take Quiz
                    </>
                  )}
                </button>
              </div>

              {/* Lesson Content */}
              {activeLesson.lessonContent && (
                <div style={{ 
                  fontSize: "16px", 
                  lineHeight: "1.7", 
                  color: "#475569",
                  marginBottom: "25px",
                  whiteSpace: "pre-wrap"
                }}>
                  {activeLesson.lessonContent}
                </div>
              )}

              {/* Video */}
              {activeLesson.videoSource === 'youtube' && activeLesson.youtubeLink && (
                <div style={{ marginBottom: "25px" }}>
                  <h4 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "15px" }}>
                    <span>🎬</span> Video Material
                  </h4>
                  <div style={{ 
                    position: "relative", 
                    width: "100%", 
                    maxWidth: "800px",
                    marginBottom: "15px"
                  }}>
                    <iframe
                      src={`https://www.youtube.com/embed/${extractYouTubeId(activeLesson.youtubeLink)}`}
                      style={{
                        width: "100%",
                        maxWidth: "800px",
                        borderRadius: "10px",
                        height: "450px",
                        border: "none"
                      }}
                      title="YouTube video player"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              )}

              {activeLesson.videoSource === 'upload' && activeLesson.videoPath && (
                <div style={{ marginBottom: "25px" }}>
                  <h4 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "15px" }}>
                    <span>🎬</span> Video Material
                  </h4>
                  <video controls style={{
                    width: "100%",
                    maxWidth: "800px",
                    borderRadius: "10px",
                    marginBottom: "20px"
                  }}>
                    <source
                      src={`http://localhost:8080/${activeLesson.videoPath}`}
                      type="video/mp4"
                    />
                  </video>
                </div>
              )}

              {/* PDF */}
              {activeLesson.pdfPath && (
                <div style={{ marginBottom: "25px" }}>
                  <h4 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "15px" }}>
                    <span>📄</span> PDF Material
                  </h4>
                  <button
                    onClick={() =>
                      window.open(
                        `http://localhost:8080/${activeLesson.pdfPath}`,
                        "_blank"
                      )
                    }
                    style={{
                      backgroundColor: "#ef4444",
                      color: "white",
                      border: "none",
                      padding: "10px 20px",
                      borderRadius: "8px",
                      fontSize: "14px",
                      fontWeight: "600",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px"
                    }}
                  >
                    <span>📖</span> View PDF
                  </button>
                </div>
              )}

              {/* Action Buttons */}
              <div style={{
                display: "flex",
                gap: "15px",
                marginTop: "30px",
                paddingTop: "25px",
                borderTop: "1px solid #e2e8f0"
              }}>
                <button
                  onClick={handleMarkAsCompleted}
                  disabled={completing || completedLessonIds.includes(activeLesson.lessonId)}
                  style={{
                    backgroundColor: completedLessonIds.includes(activeLesson.lessonId) ? "#10b981" : "#3b82f6",
                    color: "white",
                    border: "none",
                    padding: "12px 28px",
                    borderRadius: "8px",
                    fontSize: "15px",
                    fontWeight: "600",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    flex: 1
                  }}
                >
                  {completing ? (
                    <>
                      <div style={{
                        width: "16px",
                        height: "16px",
                        border: "2px solid rgba(255,255,255,0.3)",
                        borderTop: "2px solid white",
                        borderRadius: "50%",
                        animation: "spin 1s linear infinite"
                      }} />
                      Processing...
                    </>
                  ) : completedLessonIds.includes(activeLesson.lessonId) ? (
                    <>
                      <span>✅</span> Lesson Completed
                    </>
                  ) : (
                    <>
                      <span>🎯</span> Mark as Completed
                    </>
                  )}
                </button>

                <button
                  onClick={generateQuiz}
                  disabled={quizLoading}
                  style={{
                    backgroundColor: "#8b5cf6",
                    color: "white",
                    border: "none",
                    padding: "12px 28px",
                    borderRadius: "8px",
                    fontSize: "15px",
                    fontWeight: "600",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    flex: 1
                  }}
                >
                  {quizLoading ? (
                    <>
                      <div style={{
                        width: "16px",
                        height: "16px",
                        border: "2px solid rgba(255,255,255,0.3)",
                        borderTop: "2px solid white",
                        borderRadius: "50%",
                        animation: "spin 1s linear infinite"
                      }} />
                      Loading Quiz...
                    </>
                  ) : (
                    <>
                      <span>📝</span> Practice Quiz ({quizDifficulty})
                    </>
                  )}
                </button>
              </div>

              {/* Quiz Completion Status */}
              {completedLessonIds.includes(activeLesson.lessonId) && (
                <div style={{
                  marginTop: "20px",
                  padding: "15px",
                  backgroundColor: "#f0fdf4",
                  borderRadius: "8px",
                  border: "1px solid #86efac",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px"
                }}>
                  <div style={{
                    width: "30px",
                    height: "30px",
                    backgroundColor: "#10b981",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontSize: "16px"
                  }}>
                    ✓
                  </div>
                  <div>
                    <p style={{ margin: 0, fontWeight: "600", color: "#065f46" }}>
                      Lesson Completed!
                    </p>
                    <p style={{ margin: "5px 0 0 0", color: "#047857", fontSize: "14px" }}>
                      Great job! You've mastered this lesson. Try a quiz to test your knowledge.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Chatbot Component */}
      <Chatbot 
        courseId={courseId} 
        currentLesson={activeLesson}
      />

      {/* Quiz Modal */}
      {renderQuiz()}
    </>
  );
}

export default StudentLesson;