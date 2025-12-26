package com.example.demo.repository;

import com.example.demo.entity.Completed;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CompletedRepository extends JpaRepository<Completed, Long> {

    boolean existsByUser_UserIdAndLesson_LessonId(Long userId, Long lessonId);

    @Query("""
        select c.lesson.lessonId
        from Completed c
        where c.user.userId = :userId
    """)
    List<Long> findLessonIdsByUserId(@Param("userId") Long userId);
}
