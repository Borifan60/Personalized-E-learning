package com.example.demo.adaptive;

import com.example.demo.entity.User;
import jakarta.persistence.*;

@Entity
@Table(name = "learner_profile")
public class LearnerProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long profileId;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(name = "learning_style", nullable = false)
    private String learningStyle = "VISUAL"; // must match DB CHECK

    @Column(name = "preferred_content_type")
    private String preferredContentType;

    @Column(name = "knowledge_level")
    private String knowledgeLevel = "BEGINNER";

    @Column(name = "avg_score")
    private Double avgScore = 0.0;

    @Column(name = "total_time_spent")
    private Integer totalTimeSpent = 0;

    // ===== Constructors =====
    public LearnerProfile() {}

    public LearnerProfile(User user) {
        this.user = user;
    }

    // ===== Getters & Setters =====
    public Long getProfileId() {
        return profileId;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getLearningStyle() {
        return learningStyle;
    }

    public void setLearningStyle(String learningStyle) {
        this.learningStyle = learningStyle;
    }

    public String getPreferredContentType() {
        return preferredContentType;
    }

    public void setPreferredContentType(String preferredContentType) {
        this.preferredContentType = preferredContentType;
    }


    public String getKnowledgeLevel() {
        return knowledgeLevel;
    }

    public void setKnowledgeLevel(String knowledgeLevel) {
        this.knowledgeLevel = knowledgeLevel;
    }

    public Double getAvgScore() {
        return avgScore;
    }

    public void setAvgScore(Double avgScore) {
        this.avgScore = avgScore;
    }

    public Integer getTotalTimeSpent() {
        return totalTimeSpent;
    }

    public void setTotalTimeSpent(Integer totalTimeSpent) {
        this.totalTimeSpent = totalTimeSpent;
    }

    // ===== Helpers =====
    public void addTime(int minutes) {
        if (totalTimeSpent == null) totalTimeSpent = 0;
        this.totalTimeSpent += minutes;
    }
}
