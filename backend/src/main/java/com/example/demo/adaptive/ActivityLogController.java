package com.example.demo.adaptive;

import com.example.demo.entity.Completed;
import com.example.demo.entity.Lesson;
import com.example.demo.entity.User;
import com.example.demo.repository.CompletedRepository;
import com.example.demo.repository.LessonRepository;
import com.example.demo.repository.UserRepository;
import jakarta.servlet.http.HttpSession;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/activity")
public class ActivityLogController {

    private final CompletedRepository completedRepo;
    private final LessonRepository lessonRepo;
    private final LearnerProfileService profileService;
    private final ActivityLogService logService;
    private final UserRepository userRepository;

    public ActivityLogController(
            CompletedRepository completedRepo,
            LessonRepository lessonRepo,
            LearnerProfileService profileService,
            ActivityLogService logService,
            UserRepository userRepository) {

        this.completedRepo = completedRepo;
        this.lessonRepo = lessonRepo;
        this.profileService = profileService;
        this.logService = logService;
        this.userRepository = userRepository;
    }

    @PostMapping("/complete/{lessonId}")
    public String completeLesson(@PathVariable Long lessonId,
                                 HttpSession session) {

        Object uid = session.getAttribute("USER_ID"); // ⚠️ CASE SENSITIVE
        if (uid == null) return "User not logged in";

        Long userId = Long.valueOf(uid.toString());

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (completedRepo.existsByUser_UserIdAndLesson_LessonId(userId, lessonId)) {
            return "Lesson already completed";
        }

        Lesson lesson = lessonRepo.findById(lessonId)
                .orElseThrow(() -> new RuntimeException("Lesson not found"));

        completedRepo.save(new Completed(user, lesson, true));

        profileService.updateFromActivity(userId, 0.0, 5);

        logService.logActivity(
                user,
                lesson,
                "COMPLETED_LESSON: " + lesson.getLessonName()
        );

        return "Lesson marked as completed";
    }

    @GetMapping("/completed/my")
    public List<Long> myCompletedLessons(HttpSession session) {
        Object uid = session.getAttribute("user_id");
        if (uid == null) return List.of();

        Long userId = Long.valueOf(uid.toString());
        return completedRepo.findLessonIdsByUserId(userId);
    }

}