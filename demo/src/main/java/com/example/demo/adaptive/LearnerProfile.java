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
    @JoinColumn(name = "user_id", unique = true)
    private User user;

    private String learningStyle;
    private String knowledgeLevel;
    private String preferredContentType;

    @Column(name = "avg_score")
    private Integer avgScore;

    private Integer totalTimeSpent;

    // NEW FIELD: Track total lessons completed
    @Column(name = "total_lessons_completed")
    private Integer totalLessonsCompleted = 0;

    // Constructors
    public LearnerProfile() {
        this.totalLessonsCompleted = 0;
        this.avgScore = 0;
    }

    public LearnerProfile(User user) {
        this.user = user;
        this.totalLessonsCompleted = 0;
        this.avgScore = 0;
    }

    // Getters and Setters
    public Long getProfileId() { return profileId; }
    public void setProfileId(Long profileId) { this.profileId = profileId; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getLearningStyle() { return learningStyle; }
    public void setLearningStyle(String learningStyle) { this.learningStyle = learningStyle; }

    public String getKnowledgeLevel() { return knowledgeLevel; }
    public void setKnowledgeLevel(String knowledgeLevel) { this.knowledgeLevel = knowledgeLevel; }

    public String getPreferredContentType() { return preferredContentType; }
    public void setPreferredContentType(String preferredContentType) { this.preferredContentType = preferredContentType; }

    public Integer getAvgScore() { return avgScore; }
    public void setAvgScore(Integer avgScore) { this.avgScore = avgScore; }

    public Integer getTotalTimeSpent() { return totalTimeSpent; }
    public void setTotalTimeSpent(Integer totalTimeSpent) { this.totalTimeSpent = totalTimeSpent; }

    // NEW GETTERS AND SETTERS
    public Integer getTotalLessonsCompleted() {
        return totalLessonsCompleted != null ? totalLessonsCompleted : 0;
    }

    public void setTotalLessonsCompleted(Integer totalLessonsCompleted) {
        this.totalLessonsCompleted = totalLessonsCompleted != null ? totalLessonsCompleted : 0;
    }

    // Helper method to get user ID
    public Long getUserId() {
        return user != null ? user.getUserId() : null;
    }

    // Helper method to increment lessons completed
    public void incrementLessonsCompleted() {
        this.totalLessonsCompleted = getTotalLessonsCompleted() + 1;
    }
}