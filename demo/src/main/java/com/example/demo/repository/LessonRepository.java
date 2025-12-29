package com.example.demo.repository;

import com.example.demo.entity.Lesson;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface LessonRepository extends JpaRepository<Lesson, Long> {

    // Existing methods
    List<Lesson> findByCourse_CourseId(Long courseId);

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

    // NEW: Get lessons matching learner's knowledge level
    @Query("SELECT l FROM Lesson l WHERE l.course.courseId = :courseId " +
            "AND l.difficultyLevel = :difficultyLevel " +
            "ORDER BY l.lessonId ASC")
    List<Lesson> findByCourseAndDifficulty(
            @Param("courseId") Long courseId,
            @Param("difficultyLevel") String difficultyLevel);

    // NEW: Get lessons up to learner's level
    @Query("SELECT l FROM Lesson l WHERE l.course.courseId = :courseId " +
            "AND (" +
            "  (:knowledgeLevel = 'beginner' AND l.difficultyLevel = 'beginner') OR " +
            "  (:knowledgeLevel = 'intermediate' AND l.difficultyLevel IN ('beginner', 'intermediate')) OR " +
            "  (:knowledgeLevel = 'advanced' AND l.difficultyLevel IN ('beginner', 'intermediate', 'advanced'))" +
            ") " +
            "ORDER BY " +
            "  CASE l.difficultyLevel " +
            "    WHEN 'beginner' THEN 1 " +
            "    WHEN 'intermediate' THEN 2 " +
            "    WHEN 'advanced' THEN 3 " +
            "  END, " +
            "  l.lessonId ASC")
    List<Lesson> findLessonsForKnowledgeLevel(
            @Param("courseId") Long courseId,
            @Param("knowledgeLevel") String knowledgeLevel);
}