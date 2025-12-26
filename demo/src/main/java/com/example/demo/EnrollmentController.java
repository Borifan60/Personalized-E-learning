package com.example.demo;

import com.example.demo.dto.EnrolledCourseDTO;
import com.example.demo.entity.User;
import com.example.demo.repository.EnrollmentRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.security.EnrollmentService;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/enrollments")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class EnrollmentController {

    private final EnrollmentService enrollmentService;
    private final EnrollmentRepository enrollmentRepository;
    private final UserRepository userRepository;

    public EnrollmentController(
            EnrollmentService enrollmentService,
            EnrollmentRepository enrollmentRepository,
            UserRepository userRepository
    ) {
        this.enrollmentService = enrollmentService;
        this.enrollmentRepository = enrollmentRepository;
        this.userRepository = userRepository;
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

    // ✅ MY COURSES (USED BY REACT)
    @GetMapping("/my")
    public ResponseEntity<?> myEnrollments(HttpSession session) {

        Long userId = (Long) session.getAttribute("USER_ID");
        if (userId == null) {
            return ResponseEntity.status(401).body("Not logged in");
        }

        List<EnrolledCourseDTO> courses =
                enrollmentRepository.findCoursesByUserId(userId);

        return ResponseEntity.ok(courses);
    }
}
