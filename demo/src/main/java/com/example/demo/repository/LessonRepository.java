package com.example.demo.repository;

import com.example.demo.entity.Lesson;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface LessonRepository extends JpaRepository<Lesson, Long> {
    List<Lesson> findByCourse_CourseId(Long courseId);

    // Existing method
    @Query("""
        SELECT l FROM Lesson l
        WHERE l.lessonId NOT IN (
            SELECT c.lesson.lessonId
            FROM Completed c
            WHERE c.user.userId = :userId
        )
        AND l.course.courseId = :courseId
        ORDER BY l.lessonId ASC
    """)
    List<Lesson> findRecommendedLessons(
            @Param("userId") Long userId,
            @Param("courseId") Long courseId
    );

    // NEW method using native SQL that works exactly like your psql query
    @Query(value = """
        SELECT * FROM lesson
        WHERE lesson_id NOT IN (
            SELECT lesson_id FROM completed WHERE user_id = :userId
        )
        AND course_id = :courseId
        ORDER BY lesson_id ASC
    """, nativeQuery = true)
    List<Lesson> findRecommendedLessonsNative(
            @Param("userId") Long userId,
            @Param("courseId") Long courseId
    );
}


