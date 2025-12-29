package com.example.demo.repository;

import com.example.demo.entity.Completed;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface CompletedRepository extends JpaRepository<Completed, Long> {

    // Existing methods
    boolean existsByUser_UserIdAndLesson_LessonId(Long userId, Long lessonId);

    @Query("""
        select c.lesson.lessonId
        from Completed c
        where c.user.userId = :userId
    """)
    List<Long> findLessonIdsByUserId(@Param("userId") Long userId);

    // NEW: Find completed lesson IDs for specific course
    @Query("""
        SELECT c.lesson.lessonId 
        FROM Completed c 
        WHERE c.user.userId = :userId 
        AND c.lesson.course.courseId = :courseId
    """)
    List<Long> findCompletedLessonIdsByUserAndCourse(
            @Param("userId") Long userId,
            @Param("courseId") Long courseId);
}