import React, { useState } from "react";
import "./LessonSidebar.css";

function LessonSidebar({ 
  lessons, 
  activeLessonId, 
  completedLessonIds, 
  onSelectLesson,
  viewMode,
  onToggleViewMode 
}) {
  const [expandedDifficulties, setExpandedDifficulties] = useState({
    beginner: true,
    intermediate: true,
    advanced: true
  });

  // Group lessons by difficulty
  const groupLessonsByDifficulty = () => {
    const groups = {
      beginner: [],
      intermediate: [],
      advanced: []
    };
    
    lessons.forEach(lesson => {
      const difficulty = lesson.difficultyLevel?.toLowerCase() || "beginner";
      if (groups[difficulty]) {
        groups[difficulty].push(lesson);
      }
    });
    
    return groups;
  };

  const toggleDifficulty = (difficulty) => {
    setExpandedDifficulties(prev => ({
      ...prev,
      [difficulty]: !prev[difficulty]
    }));
  };

  const lessonGroups = groupLessonsByDifficulty();
  
  // Calculate completion percentages
  const calculateCompletion = (difficultyLessons) => {
    if (!difficultyLessons.length) return 0;
    const completed = difficultyLessons.filter(lesson => 
      completedLessonIds.includes(lesson.lessonId)
    ).length;
    return Math.round((completed / difficultyLessons.length) * 100);
  };

  const getDifficultyIcon = (difficulty) => {
    switch(difficulty) {
      case "beginner": return "🟢";
      case "intermediate": return "🟡";
      case "advanced": return "🔴";
      default: return "📘";
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case "beginner": return "#10b981";
      case "intermediate": return "#f59e0b";
      case "advanced": return "#ef4444";
      default: return "#6b7280";
    }
  };

  return (
    <div className="lesson-sidebar">
      {/* Header */}
      <div className="sidebar-header">
        <h3>
          {viewMode === "personalized" ? "Personalized Lessons" : "All Lessons"}
        </h3>
        
        {onToggleViewMode && (
          <button 
            className="view-toggle-btn"
            onClick={onToggleViewMode}
            title={viewMode === "personalized" ? "Show all lessons" : "Show personalized only"}
          >
            {viewMode === "personalized" ? "🌐 View All" : "🎯 Personalized"}
          </button>
        )}
        
        <div className="total-lessons">
          {lessons.length} {lessons.length === 1 ? "Lesson" : "Lessons"}
        </div>
      </div>

      {/* Difficulty Groups */}
      {Object.entries(lessonGroups).map(([difficulty, difficultyLessons]) => {
        if (difficultyLessons.length === 0) return null;
        
        const completionPercent = calculateCompletion(difficultyLessons);
        const isExpanded = expandedDifficulties[difficulty];
        
        return (
          <div key={difficulty} className="difficulty-group">
            <div 
              className="difficulty-header"
              onClick={() => toggleDifficulty(difficulty)}
              style={{ borderLeftColor: getDifficultyColor(difficulty) }}
            >
              <div className="difficulty-title">
                <span className="difficulty-icon">{getDifficultyIcon(difficulty)}</span>
                <span className="difficulty-text">
                  {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                </span>
                <span className="lesson-count">({difficultyLessons.length})</span>
              </div>
              
              <div className="difficulty-controls">
                <div className="completion-bar">
                  <div 
                    className="completion-fill"
                    style={{ 
                      width: `${completionPercent}%`,
                      backgroundColor: getDifficultyColor(difficulty)
                    }}
                  />
                </div>
                <span className="completion-text">{completionPercent}%</span>
                <span className="toggle-icon">
                  {isExpanded ? "▲" : "▼"}
                </span>
              </div>
            </div>
            
            {isExpanded && (
              <div className="lesson-list">
                {difficultyLessons.map((lesson) => {
                  const isActive = activeLessonId === lesson.lessonId;
                  const isCompleted = completedLessonIds.includes(lesson.lessonId);
                  
                  return (
                    <div
                      key={lesson.lessonId}
                      className={`lesson-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                      onClick={() => onSelectLesson && onSelectLesson(lesson)}
                    >
                      <div className="lesson-item-content">
                        <div className="lesson-title-row">
                          <span className="lesson-icon">
                            {isCompleted ? "✅" : "📘"}
                          </span>
                          <span className="lesson-title">
                            {lesson.lessonName}
                          </span>
                        </div>
                        
                        <div className="lesson-meta">
                          {lesson.videoSource === 'youtube' && (
                            <span className="meta-tag youtube">YouTube</span>
                          )}
                          {lesson.videoSource === 'upload' && (
                            <span className="meta-tag video">Video</span>
                          )}
                          {lesson.pdfPath && (
                            <span className="meta-tag pdf">PDF</span>
                          )}
                          {lesson.estimatedTimeMinutes && (
                            <span className="meta-tag time">
                              ⏱️ {lesson.estimatedTimeMinutes}m
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {isActive && (
                        <div className="active-indicator">
                          <div className="active-dot" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
      
      {/* Completion Summary */}
      {completedLessonIds.length > 0 && (
        <div className="completion-summary">
          <div className="summary-header">
            <span className="summary-icon">📊</span>
            <span className="summary-text">Progress Summary</span>
          </div>
          <div className="summary-stats">
            <div className="stat-item">
              <span className="stat-value">{completedLessonIds.length}</span>
              <span className="stat-label">Completed</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{lessons.length - completedLessonIds.length}</span>
              <span className="stat-label">Remaining</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">
                {lessons.length > 0 
                  ? Math.round((completedLessonIds.length / lessons.length) * 100) 
                  : 0}%
              </span>
              <span className="stat-label">Overall</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LessonSidebar;