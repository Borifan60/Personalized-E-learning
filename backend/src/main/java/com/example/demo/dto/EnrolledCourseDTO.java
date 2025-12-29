package com.example.demo.dto;

public class EnrolledCourseDTO {
    private Long courseId;
    private String courseName;

    // Constructor
    public EnrolledCourseDTO(Long courseId, String courseName) {
        this.courseId = courseId;
        this.courseName = courseName;
    }

    // Getters and setters
    public Long getCourseId() { return courseId; }
    public void setCourseId(Long courseId) { this.courseId = courseId; }

    public String getCourseName() { return courseName; }
    public void setCourseName(String courseName) { this.courseName = courseName; }
}