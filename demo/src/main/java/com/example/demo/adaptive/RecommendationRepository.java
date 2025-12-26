package com.example.demo.adaptive;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RecommendationRepository extends JpaRepository<Recommendation, Long> {

    // Get all recommendations for a user
    List<Recommendation> findByUser_UserId(Long userId);

    // Optional: delete old recommendations before generating new ones
    void deleteByUser_UserId(Long userId);
}

