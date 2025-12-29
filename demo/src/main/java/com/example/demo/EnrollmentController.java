package com.example.demo;

import com.example.demo.adaptive.LearnerProfile;
import com.example.demo.repository.LearnerProfileRepository;
import com.example.demo.dto.EnrolledCourseDTO;
import com.example.demo.entity.User;
import com.example.demo.repository.EnrollmentRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.security.EnrollmentService;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/enrollments")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class EnrollmentController {

    private final EnrollmentService enrollmentService;
    private final EnrollmentRepository enrollmentRepository;
    private final UserRepository userRepository;
    private final LearnerProfileRepository learnerProfileRepository;

    public EnrollmentController(
            EnrollmentService enrollmentService,
            EnrollmentRepository enrollmentRepository,
            UserRepository userRepository,
            LearnerProfileRepository learnerProfileRepository
    ) {
        this.enrollmentService = enrollmentService;
        this.enrollmentRepository = enrollmentRepository;
        this.userRepository = userRepository;
        this.learnerProfileRepository = learnerProfileRepository;
    }

    // ✅ ENROLL (creates enrollment + learner_profile)
    @PostMapping("/enroll/{courseId}")
    public ResponseEntity<String> enroll(
            @PathVariable Long courseId,
            HttpSession session
    ) {
        Long userId = (Long) session.getAttribute("USER_ID");
        if (userId == null) {
            return ResponseEntity.status(401).body("Login required");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        enrollmentService.enrollStudent(user, courseId);
        return ResponseEntity.ok("Successfully enrolled");
    }

    // ✅ MY COURSES (USED BY REACT) - Returns List<EnrolledCourseDTO>
    @GetMapping("/my")
    public ResponseEntity<?> myEnrollments(HttpSession session) {
        Long userId = (Long) session.getAttribute("USER_ID");
        if (userId == null) {
            return ResponseEntity.status(401).body("Not logged in");
        }

        List<EnrolledCourseDTO> courses = enrollmentRepository.findCoursesByUserId(userId);
        return ResponseEntity.ok(courses);
    }

    // ✅ CHECK ENROLLMENT STATUS WITH QUIZ INFO
    @GetMapping("/check/{courseId}")
    public ResponseEntity<?> checkEnrollment(
            @PathVariable Long courseId,
            HttpSession session
    ) {
        Long userId = (Long) session.getAttribute("USER_ID");
        if (userId == null) {
            return ResponseEntity.status(401).body("Not authenticated");
        }

        // Check if enrolled in this specific course
        boolean enrolled = enrollmentRepository.existsByUserIdAndCourseId(userId, courseId);

        // Get all enrolled course IDs
        List<Long> enrolledCourseIds = enrollmentRepository.findCourseIdsByUserId(userId);

        // Check quiz status from learner_profile
        boolean quizTaken = false;
        Integer quizScore = null;
        String knowledgeLevel = null;

        Optional<LearnerProfile> profile = learnerProfileRepository.findByUser_UserId(userId);
        if (profile.isPresent()) {
            quizScore = profile.get().getAvgScore();
            quizTaken = quizScore != null;
            knowledgeLevel = profile.get().getKnowledgeLevel();
        }

        Map<String, Object> response = new HashMap<>();
        response.put("enrolled", enrolled);
        response.put("quizTaken", quizTaken);
        response.put("quizScore", quizScore);
        response.put("knowledgeLevel", knowledgeLevel);
        response.put("enrolledCourseIds", enrolledCourseIds);

        return ResponseEntity.ok(response);
    }

    // ✅ GET ENROLLED COURSE IDs ONLY (Simplified for frontend)
    @GetMapping("/my/ids")
    public ResponseEntity<?> myEnrolledCourseIds(HttpSession session) {
        Long userId = (Long) session.getAttribute("USER_ID");
        if (userId == null) {
            return ResponseEntity.status(401).body("Not logged in");
        }

        List<Long> courseIds = enrollmentRepository.findCourseIdsByUserId(userId);
        return ResponseEntity.ok(courseIds); // Returns List<Long>
    }

    // ✅ QUIZ ENDPOINT (Save quiz score)
    // ✅ QUIZ ENDPOINT (Accept form data)
    @PostMapping("/quiz")
    public ResponseEntity<?> saveQuizScore(
            @RequestParam Long courseId,        // Change from @RequestBody to @RequestParam
            @RequestParam Integer avgScore,     // Change from @RequestBody to @RequestParam
            HttpSession session
    ) {
        Long userId = (Long) session.getAttribute("USER_ID");
        if (userId == null) {
            return ResponseEntity.status(401).body("Not authenticated");
        }

        try {
            // Find or create learner profile
            Optional<LearnerProfile> profileOpt = learnerProfileRepository.findByUser_UserId(userId);
            LearnerProfile profile;

            if (profileOpt.isPresent()) {
                profile = profileOpt.get();
            } else {
                profile = new LearnerProfile();
                profile.setUser(userRepository.findById(userId).orElseThrow(() ->
                        new RuntimeException("User not found")));
            }

            profile.setAvgScore(avgScore);

            if (avgScore >= 70) {
                profile.setKnowledgeLevel("advanced");
            } else if (avgScore >= 40) {
                profile.setKnowledgeLevel("intermediate");
            } else {
                profile.setKnowledgeLevel("beginner");
            }

            learnerProfileRepository.save(profile);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Quiz score saved successfully");
            response.put("avgScore", avgScore);
            response.put("knowledgeLevel", profile.getKnowledgeLevel());
            response.put("courseId", courseId);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to save quiz score");
            errorResponse.put("details", e.getMessage());
            return ResponseEntity.status(500).body(errorResponse);
        }
    }
}