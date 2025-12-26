package com.example.demo.adaptive;

import com.example.demo.entity.Lesson;
import jakarta.servlet.http.HttpSession;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/recommendations")
public class RecommendationController {

    private final RecommendationService recommendationService;

    public RecommendationController(RecommendationService recommendationService) {
        this.recommendationService = recommendationService;
    }

    @GetMapping("/course/{courseId}")
    public Lesson getRecommendation(
            @PathVariable Long courseId,
            HttpSession session
    ) {
        Object uid = session.getAttribute("USER_ID"); // ⚠️ FIXED KEY
        if (uid == null) return null;

        Long userId = Long.valueOf(uid.toString());

        return recommendationService.recommendNextLesson(userId, courseId);
    }

}
