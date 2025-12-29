package com.example.demo.adaptive;

import com.example.demo.entity.Lesson;
import com.example.demo.repository.LessonRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RecommendationService {

    private final LessonRepository lessonRepository;

    public RecommendationService(LessonRepository lessonRepository) {
        this.lessonRepository = lessonRepository;
    }

    public Lesson recommendNextLesson(Long userId, Long courseId) {
        List<Lesson> remaining =
                lessonRepository.findRecommendedLessons(userId, courseId);

        // 🔹 Recommend ONLY ONE (next lesson)
        return remaining.isEmpty() ? null : remaining.get(0);
    }
}
