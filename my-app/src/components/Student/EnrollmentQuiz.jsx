import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';

function EnrollmentQuiz() {
  const navigate = useNavigate();
  const { courseId } = useParams(); // Get courseId from URL params
  const location = useLocation();
  
  const courseName = location.state?.courseName;
  const isRetake = location.state?.isRetake || false;
  
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [score, setScore] = useState(null);
  const [error, setError] = useState(null);
  
  // Validate and convert courseId
  const numericCourseId = React.useMemo(() => {
    if (!courseId || courseId === "undefined" || courseId === "null") {
      console.error('Invalid courseId:', courseId);
      setError('Invalid course ID. Please select a course first.');
      return null;
    }
    
    const id = Number(courseId);
    if (isNaN(id) || id <= 0) {
      console.error('Invalid numeric courseId:', courseId);
      setError('Invalid course ID format. Please select a valid course.');
      return null;
    }
    
    return id;
  }, [courseId]);
  
  // Debug logging
  useEffect(() => {
    console.log('🎯 EnrollmentQuiz Debug:', {
      courseIdFromParams: courseId,
      numericCourseId: numericCourseId,
      typeOfCourseId: typeof courseId,
      locationState: location.state,
      courseName,
      isRetake
    });
    
    if (numericCourseId) {
      // Store in localStorage for backup
      localStorage.setItem('currentCourseId', numericCourseId.toString());
    }
  }, [courseId, numericCourseId, location.state, courseName, isRetake]);
  
  // Show error if courseId is invalid
  if (error || !numericCourseId) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">
          <h4>Error Loading Quiz</h4>
          <p>{error || 'Course ID is not valid.'}</p>
          <div className="mt-3">
            <button 
              className="btn btn-primary me-2"
              onClick={() => navigate('/student/courses')}
            >
              <i className="fas fa-arrow-left me-1"></i>
              Back to Courses
            </button>
            <button 
              className="btn btn-secondary"
              onClick={() => window.location.reload()}
            >
              <i className="fas fa-redo me-1"></i>
              Reload Page
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  const questions = [
    {
      id: 1,
      question: "How would you rate your experience with this subject?",
      options: [
        { value: 'beginner', label: 'Beginner - Just starting out' },
        { value: 'intermediate', label: 'Intermediate - Some knowledge' },
        { value: 'advanced', label: 'Advanced - Comfortable with concepts' }
      ]
    },
    {
      id: 2,
      question: "How do you prefer to learn?",
      options: [
        { value: 'video', label: 'Video tutorials' },
        { value: 'reading', label: 'Reading materials' },
        { value: 'interactive', label: 'Interactive exercises' },
        { value: 'mixed', label: 'Mixed approach' }
      ]
    },
    {
      id: 3,
      question: "What's your primary goal for this course?",
      options: [
        { value: 'foundation', label: 'Build strong foundation' },
        { value: 'quick', label: 'Quick practical skills' },
        { value: 'deep', label: 'Deep theoretical understanding' }
      ]
    },
    {
      id: 4,
      question: "How much time can you dedicate weekly?",
      options: [
        { value: 'light', label: '2-4 hours' },
        { value: 'moderate', label: '5-10 hours' },
        { value: 'intensive', label: '10+ hours' }
      ]
    },
    {
      id: 5,
      question: "Rate your confidence with practical exercises",
      options: [
        { value: 'low', label: 'Need step-by-step guidance' },
        { value: 'medium', label: 'Can follow examples' },
        { value: 'high', label: 'Can work independently' }
      ]
    }
  ];

  // Calculate average score (0-100)
  const calculateScore = () => {
    const scores = {
      'beginner': 30,
      'intermediate': 70,
      'advanced': 95,
      'video': 25,
      'reading': 25,
      'interactive': 25,
      'mixed': 25,
      'foundation': 30,
      'quick': 60,
      'deep': 90,
      'light': 30,
      'moderate': 60,
      'intensive': 90,
      'low': 30,
      'medium': 60,
      'high': 90
    };
    
    let total = 0;
    Object.values(answers).forEach(answer => {
      total += scores[answer] || 50;
    });
    
    return Math.round(total / Object.keys(answers).length);
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length < questions.length) {
      Swal.fire({
        icon: 'warning',
        title: 'Incomplete Quiz',
        text: 'Please answer all questions before submitting.',
        confirmButtonText: 'OK',
        confirmButtonColor: '#3085d6'
      });
      return;
    }
    
    setSubmitting(true);
    const avgScore = calculateScore();
    
    console.log('📊 Quiz Results:', {
      courseId: numericCourseId,
      avgScore: avgScore,
      answers: answers
    });
    
    try {
      // ✅ FIXED: Send as form data (x-www-form-urlencoded)
      const formData = new URLSearchParams();
      formData.append('courseId', numericCourseId.toString());
      formData.append('avgScore', avgScore.toString());
      
      console.log('📤 Sending to server:', formData.toString());
      
      const response = await fetch('http://localhost:8080/enrollments/quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        credentials: 'include',
        body: formData
      });
      
      const responseText = await response.text();
      console.log('📥 Response status:', response.status);
      console.log('📥 Response text:', responseText);
      
      if (!response.ok) {
        let errorMsg = `Server error: ${response.status}`;
        try {
          const errorData = JSON.parse(responseText);
          errorMsg = errorData.message || errorData.error || errorMsg;
        } catch (e) {
          if (responseText && responseText.trim()) {
            errorMsg = responseText;
          }
        }
        throw new Error(errorMsg);
      }
      
      // Parse response
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        data = { message: responseText };
      }
      
      console.log('✅ Quiz saved successfully:', data);
      
      // Save to localStorage
      localStorage.setItem(`quiz_score_${numericCourseId}`, avgScore.toString());
      localStorage.setItem(`quiz_answers_${numericCourseId}`, JSON.stringify(answers));
      localStorage.setItem(`quiz_level_${numericCourseId}`, 
        avgScore >= 70 ? 'advanced' : avgScore >= 40 ? 'intermediate' : 'beginner'
      );
      
      // Update score state to show success screen
      setScore(avgScore);
      
    } catch (error) {
      console.error('❌ Error saving quiz:', error);
      
      Swal.fire({
        icon: 'error',
        title: 'Submission Failed',
        html: `
          <div class="text-start">
            <p><strong>Error:</strong> ${error.message}</p>
            <p class="small text-muted mt-2">
              Please check your internet connection and try again.
            </p>
          </div>
        `,
        confirmButtonText: 'Try Again',
        confirmButtonColor: '#d33'
      }).then(() => {
        setSubmitting(false);
      });
    }
  };

  const handleSkip = () => {
    Swal.fire({
      title: 'Skip Assessment?',
      text: 'You can take this quiz later from the course page.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, Skip',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33'
    }).then((result) => {
      if (result.isConfirmed) {
        navigate(`/student/course/${numericCourseId}`);
      }
    });
  };

  // If score is submitted, show success screen
  if (score !== null) {
    const level = score >= 70 ? 'Advanced' : score >= 40 ? 'Intermediate' : 'Beginner';
    const levelColor = score >= 70 ? '#10b981' : score >= 40 ? '#f59e0b' : '#ef4444';
    const levelEmoji = score >= 70 ? '🚀' : score >= 40 ? '📈' : '🎯';
    
    return (
      <div className="container mt-4">
        <div className="card shadow-lg border-0" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div className="card-body p-5 text-center">
            <div className="mb-4">
              <div className="display-1 text-success mb-3">✅</div>
              <h2 className="card-title mb-3">Assessment Submitted Successfully!</h2>
              
              {courseName && (
                <div className="alert alert-info d-inline-block mb-3">
                  <i className="fas fa-book me-2"></i>
                  <strong>Course:</strong> {courseName}
                </div>
              )}
              
              <div className="d-flex flex-column align-items-center gap-3 mb-4">
                <span 
                  className="badge fs-5 py-2 px-4 rounded-pill"
                  style={{ 
                    backgroundColor: levelColor, 
                    color: 'white',
                    fontWeight: '600'
                  }}
                >
                  {levelEmoji} {level} Level
                </span>
                
                <div className="fs-4">
                  Your score: <span className="fw-bold">{score}/100</span>
                </div>
              </div>
            </div>
            
            <div className="alert alert-primary text-start mb-4">
              <h5 className="d-flex align-items-center mb-3">
                <i className="fas fa-lightbulb text-primary me-2"></i>
                What this means for your learning:
              </h5>
              <ul className="mb-0 ps-3">
                <li className="mb-2">Lessons will be matched to your skill level</li>
                <li className="mb-2">You'll receive personalized recommendations</li>
                <li className="mb-2">Your learning path adapts as you progress</li>
                <li>You can retake this assessment anytime</li>
              </ul>
            </div>
            
            <div className="d-flex flex-column flex-md-row justify-content-center gap-3 mt-4">
              <button
                onClick={() => navigate(`/student/course/${numericCourseId}`)}
                className="btn btn-primary btn-lg px-4"
                style={{ minWidth: '200px' }}
              >
                <i className="fas fa-play-circle me-2"></i>
                Start Learning
              </button>
              
              <button
                onClick={() => navigate('/student/courses')}
                className="btn btn-outline-secondary btn-lg px-4"
                style={{ minWidth: '200px' }}
              >
                <i className="fas fa-book me-2"></i>
                Browse More Courses
              </button>
            </div>
            
            <div className="alert alert-light mt-4">
              <i className="fas fa-info-circle me-2"></i>
              Redirecting to course in a few seconds...
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="card shadow-lg border-0" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div className="card-body p-4">
          {/* Header */}
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-start mb-4">
            <div className="mb-3 mb-md-0">
              <h2 className="card-title mb-2">
                <span className="me-2">🎯</span>
                Personal Learning Assessment
              </h2>
              <p className="text-muted mb-0">
                {isRetake ? 'Retake your assessment for ' : 'Help us personalize your learning experience for '}
                {courseName ? <strong className="text-primary">{courseName}</strong> : 'this course'}
              </p>
            </div>
            <button
              onClick={handleSkip}
              className="btn btn-outline-secondary"
            >
              <i className="fas fa-forward me-1"></i>
              Skip for Now
            </button>
          </div>
          
          {/* Info Box */}
          <div className="alert alert-info border-start-4 border-start-info mb-4">
            <div className="d-flex align-items-center">
              <i className="fas fa-info-circle fs-4 me-3"></i>
              <div>
                <p className="mb-0 fw-medium">
                  Answer these 5 questions to get a personalized learning path. 
                  This takes about 2 minutes.
                </p>
              </div>
            </div>
          </div>
          
          {/* Questions */}
          {questions.map((q, index) => (
            <div key={q.id} className="card mb-3 border">
              <div className="card-body">
                <div className="d-flex align-items-start mb-3">
                  <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-3"
                    style={{ width: '36px', height: '36px', flexShrink: 0 }}>
                    <span className="fw-bold">{index + 1}</span>
                  </div>
                  <h5 className="card-title mb-0 text-dark">
                    {q.question}
                  </h5>
                </div>
                
                <div className="row g-3 ms-1">
                  {q.options.map(option => (
                    <div key={option.value} className="col-12 col-md-6">
                      <div className={`form-check border rounded p-3 h-100 ${answers[q.id] === option.value ? 'border-primary bg-light' : 'border-light'}`}
                           style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                           onClick={() => setAnswers({...answers, [q.id]: option.value})}>
                        <input
                          type="radio"
                          name={`question-${q.id}`}
                          value={option.value}
                          checked={answers[q.id] === option.value}
                          onChange={() => {}}
                          className="form-check-input"
                          style={{ transform: 'scale(1.2)', marginTop: '0.2rem' }}
                        />
                        <label className="form-check-label ms-2 w-100" style={{ cursor: 'pointer' }}>
                          <div className="fw-medium">{option.label}</div>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
          
          {/* Footer with submit button */}
          <div className="border-top pt-4 mt-3">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4">
              <div className="mb-3 mb-md-0">
                <div className="d-flex align-items-center">
                  <div className={`rounded-circle me-2 ${Object.keys(answers).length === questions.length ? 'bg-success' : 'bg-secondary'}`}
                       style={{ width: '12px', height: '12px' }}></div>
                  <span className="text-muted">
                    {Object.keys(answers).length} of {questions.length} questions answered
                  </span>
                </div>
                
                {Object.keys(answers).length === questions.length && (
                  <div className="alert alert-success d-inline-flex align-items-center py-1 px-3 mt-2">
                    <i className="fas fa-check-circle me-2"></i>
                    Ready to submit!
                  </div>
                )}
              </div>
              
              <button
                onClick={handleSubmit}
                disabled={submitting || Object.keys(answers).length < questions.length}
                className={`btn btn-lg ${Object.keys(answers).length === questions.length ? 'btn-success' : 'btn-secondary'}`}
                style={{ minWidth: '220px' }}
              >
                {submitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Submitting...
                  </>
                ) : Object.keys(answers).length === questions.length ? (
                  <>
                    <i className="fas fa-paper-plane me-2"></i>
                    Submit Assessment
                  </>
                ) : (
                  <>
                    <i className="fas fa-lock me-2"></i>
                    Complete All Questions
                  </>
                )}
              </button>
            </div>
            
            {/* Estimated Level Preview */}
            {Object.keys(answers).length === questions.length && (
              <div className="alert alert-primary">
                <div className="d-flex align-items-center justify-content-center mb-2">
                  <i className="fas fa-chart-line me-2"></i>
                  <span className="fw-bold">
                    Estimated Learning Level: {calculateScore() >= 70 ? 'Advanced' : calculateScore() >= 40 ? 'Intermediate' : 'Beginner'}
                  </span>
                </div>
                <p className="text-center mb-0 text-muted">
                  Your lessons will be personalized based on this assessment
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Debug panel - remove in production */}
      {process.env.NODE_ENV === 'development' && (
        <div className="card mt-3 bg-light">
          <div className="card-body py-2">
            <details>
              <summary className="small">Debug Info</summary>
              <div className="small mt-2">
                <p><strong>Course ID:</strong> {numericCourseId} (type: {typeof numericCourseId})</p>
                <p><strong>Answers:</strong> {JSON.stringify(answers)}</p>
                <p><strong>Current Score:</strong> {Object.keys(answers).length > 0 ? calculateScore() : 'N/A'}</p>
                <button 
                  className="btn btn-sm btn-outline-dark me-2"
                  onClick={() => console.log('Answers:', answers)}
                >
                  Log Answers
                </button>
                <button 
                  className="btn btn-sm btn-outline-dark"
                  onClick={() => {
                    const formData = new URLSearchParams();
                    formData.append('courseId', numericCourseId.toString());
                    formData.append('avgScore', '85');
                    console.log('Test form data:', formData.toString());
                  }}
                >
                  Test Form Data
                </button>
              </div>
            </details>
          </div>
        </div>
      )}
    </div>
  );
}

export default EnrollmentQuiz;