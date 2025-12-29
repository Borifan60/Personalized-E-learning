package com.example.demo.adaptive;

import com.example.demo.entity.User;
import com.example.demo.entity.Lesson;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "activity_log")
public class ActivityLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long activityId;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(optional = false)
    @JoinColumn(name = "lesson_id")
    private Lesson lesson;

    @Column(nullable = false)
    private String action;

    @Column(name = "timestamp")
    private LocalDateTime timestamp = LocalDateTime.now();

    // ===== setters =====
    public void setUser(User user) {
        this.user = user;
    }

    public void setLesson(Lesson lesson) {
        this.lesson = lesson;
    }

    public void setAction(String action) {
        this.action = action;
    }
}
