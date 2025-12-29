package com.example.demo.repository;

import com.example.demo.dto.EnrolledCourseDTO;
import com.example.demo.entity.Course;
import com.example.demo.entity.Enrollment;
import com.example.demo.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {

    Optional<Enrollment> findByUserAndCourse(User user, Course course);

    // ✅ RETURN DTO (NOT ENTITY) - For getting course details
    @Query("""
        SELECT new com.example.demo.dto.EnrolledCourseDTO(
            c.courseId,
            c.courseName
        )
        FROM Enrollment e
        JOIN e.course c
        WHERE e.user.id = :userId
    """)
    List<EnrolledCourseDTO> findCoursesByUserId(@Param("userId") Long userId);

    // ✅ RETURN ONLY COURSE IDs - For quick enrollment checks
    @Query("SELECT e.course.courseId FROM Enrollment e WHERE e.user.id = :userId")
    List<Long> findCourseIdsByUserId(@Param("userId") Long userId);

    // ✅ CHECK IF ENROLLED IN SPECIFIC COURSE
    @Query("SELECT COUNT(e) > 0 FROM Enrollment e WHERE e.user.id = :userId AND e.course.courseId = :courseId")
    boolean existsByUserIdAndCourseId(@Param("userId") Long userId, @Param("courseId") Long courseId);
}