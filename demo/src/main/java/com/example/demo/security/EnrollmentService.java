package com.example.demo.security;

import com.example.demo.adaptive.LearnerProfileService;
import com.example.demo.entity.Course;
import com.example.demo.entity.Enrollment;
import com.example.demo.entity.User;
import com.example.demo.repository.CourseRepository;
import com.example.demo.repository.EnrollmentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class EnrollmentService {

    private final EnrollmentRepository enrollmentRepository;
    private final CourseRepository courseRepository;
    private final LearnerProfileService learnerProfileService;

    public EnrollmentService(
            EnrollmentRepository enrollmentRepository,
            CourseRepository courseRepository,
            LearnerProfileService learnerProfileService
    ) {
        this.enrollmentRepository = enrollmentRepository;
        this.courseRepository = courseRepository;
        this.learnerProfileService = learnerProfileService;
    }

    @Transactional
    public Enrollment enrollStudent(User user, Long courseId) {

        // 1️⃣ Find course
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() ->
                        new RuntimeException("Course not found with id: " + courseId));

        // 2️⃣ Check duplicate enrollment
        boolean alreadyEnrolled =
                enrollmentRepository.findByUserAndCourse(user, course).isPresent();

        if (alreadyEnrolled) {
            throw new RuntimeException("Student already enrolled in this course");
        }

        // 3️⃣ Create and save enrollment using constructor
        Enrollment enrollment = new Enrollment(user, course);
        enrollmentRepository.save(enrollment);

        // 4️⃣ ADAPTIVE HOOK
        learnerProfileService.createProfileIfNotExists(user);

        return enrollment;
    }
}
