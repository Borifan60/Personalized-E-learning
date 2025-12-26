package com.example.demo.adaptive;

import com.example.demo.entity.User;
import com.example.demo.entity.Lesson;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ActivityLogService {

    private final ActivityLogRepository activityLogRepository;

    public ActivityLogService(ActivityLogRepository activityLogRepository) {
        this.activityLogRepository = activityLogRepository;
    }

    @Transactional
    public void logActivity(User user, Lesson lesson, String action) {

        ActivityLog log = new ActivityLog();
        log.setUser(user);
        log.setLesson(lesson);   // ✅ IMPORTANT
        log.setAction(action);

        activityLogRepository.save(log);
    }
}
