package com.example.demo.adaptive;

public class RecommendationDTO {

    private Long lessonId;
    private String lessonName;
    private String reason;

    public RecommendationDTO(Long lessonId, String lessonName, String reason) {
        this.lessonId = lessonId;
        this.lessonName = lessonName;
        this.reason = reason;
    }

    public Long getLessonId() {
        return lessonId;
    }

    public String getLessonName() {
        return lessonName;
    }

    public String getReason() {
        return reason;
    }
}

