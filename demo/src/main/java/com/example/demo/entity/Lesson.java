package com.example.demo.entity;

import jakarta.persistence.*;

@Entity
public class Lesson {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long lessonId;

    private String lessonName;

    @Column(name = "lesson_content", columnDefinition = "TEXT")
    private String lessonContent;

    private String pdfPath;
    private String videoPath;

    // NEW: Add YouTube link field
    private String youtubeLink;

    // NEW: Add video source type (none, upload, youtube)
    private String videoSource;

    @ManyToOne
    @JoinColumn(name = "course_id")
    private Course course;

    // ===== Constructors =====
    public Lesson() {
        this.videoSource = "none"; // Default value
    }

    public Lesson(String lessonName, String lessonContent, String pdfPath, String videoPath, String youtubeLink, String videoSource, Course course) {
        this.lessonName = lessonName;
        this.lessonContent = lessonContent;
        this.pdfPath = pdfPath;
        this.videoPath = videoPath;
        this.youtubeLink = youtubeLink;
        this.videoSource = videoSource != null ? videoSource : "none";
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

    // NEW: YouTube link getter and setter
    public String getYoutubeLink() {
        return youtubeLink;
    }

    public void setYoutubeLink(String youtubeLink) {
        this.youtubeLink = youtubeLink;
    }

    // NEW: Video source getter and setter
    public String getVideoSource() {
        return videoSource;
    }

    public void setVideoSource(String videoSource) {
        this.videoSource = videoSource != null ? videoSource : "none";
    }

    public Course getCourse() {
        return course;
    }

    public void setCourse(Course course) {
        this.course = course;
    }
}