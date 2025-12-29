package com.example.demo.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "lesson")
public class Lesson {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long lessonId;

    private String lessonName;

    @Column(name = "lesson_content", columnDefinition = "TEXT")
    private String lessonContent;

    private String pdfPath;
    private String videoPath;
    private String youtubeLink;
    private String videoSource;

    // NEW: Difficulty level for adaptive learning
    @Column(name = "difficulty_level")
    private String difficultyLevel = "beginner"; // beginner/intermediate/advanced

    @ManyToOne
    @JoinColumn(name = "course_id")
    private Course course;

    // ===== Constructors =====
    public Lesson() {
        this.videoSource = "none";
        this.difficultyLevel = "beginner";
    }

    public Lesson(String lessonName, String lessonContent, String pdfPath,
                  String videoPath, String youtubeLink, String videoSource,
                  String difficultyLevel, Course course) {
        this.lessonName = lessonName;
        this.lessonContent = lessonContent;
        this.pdfPath = pdfPath;
        this.videoPath = videoPath;
        this.youtubeLink = youtubeLink;
        this.videoSource = videoSource != null ? videoSource : "none";
        this.difficultyLevel = difficultyLevel != null ? difficultyLevel : "beginner";
        this.course = course;
    }

    // ===== Getters & Setters =====
    public Long getLessonId() {
        return lessonId;
    }

    public void setLessonId(Long lessonId) {
        this.lessonId = lessonId;
    }

    public String getLessonName() {
        return lessonName;
    }

    public void setLessonName(String lessonName) {
        this.lessonName = lessonName;
    }

    public String getLessonContent() {
        return lessonContent;
    }

    public void setLessonContent(String lessonContent) {
        this.lessonContent = lessonContent;
    }

    public String getPdfPath() {
        return pdfPath;
    }

    public void setPdfPath(String pdfPath) {
        this.pdfPath = pdfPath;
    }

    public String getVideoPath() {
        return videoPath;
    }

    public void setVideoPath(String videoPath) {
        this.videoPath = videoPath;
    }

    public String getYoutubeLink() {
        return youtubeLink;
    }

    public void setYoutubeLink(String youtubeLink) {
        this.youtubeLink = youtubeLink;
    }

    public String getVideoSource() {
        return videoSource;
    }

    public void setVideoSource(String videoSource) {
        this.videoSource = videoSource != null ? videoSource : "none";
    }

    public String getDifficultyLevel() {
        return difficultyLevel;
    }

    public void setDifficultyLevel(String difficultyLevel) {
        this.difficultyLevel = difficultyLevel != null ? difficultyLevel : "beginner";
    }

    public Course getCourse() {
        return course;
    }

    public void setCourse(Course course) {
        this.course = course;
    }

    // Helper method to get difficulty as numeric value
    public int getDifficultyValue() {
        return switch (difficultyLevel.toLowerCase()) {
            case "beginner" -> 1;
            case "intermediate" -> 2;
            case "advanced" -> 3;
            default -> 1;
        };
    }
}