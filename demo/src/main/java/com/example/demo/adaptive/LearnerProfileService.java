package com.example.demo.adaptive;

import com.example.demo.entity.User;
import com.example.demo.repository.LearnerProfileRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class LearnerProfileService {

    private final LearnerProfileRepository learnerProfileRepository;

    public LearnerProfileService(LearnerProfileRepository learnerProfileRepository) {
        this.learnerProfileRepository = learnerProfileRepository;
    }

    @Transactional
    public LearnerProfile createProfileIfNotExists(User user) {
        return learnerProfileRepository.findByUser_UserId(user.getUserId())
                .orElseGet(() -> {
                    LearnerProfile profile = new LearnerProfile();
                    profile.setUser(user);
                    profile.setLearningStyle("VISUAL"); // must satisfy CHECK constraint
                    profile.setKnowledgeLevel("BEGINNER");
                    profile.setAvgScore(0); // CHANGE: Integer instead of Double
                    profile.setTotalTimeSpent(0);
                    profile.setPreferredContentType(null);
                    return learnerProfileRepository.save(profile);
                });
    }

    // Existing method for updating profile after activity
    @Transactional
    public void updateFromActivity(Long userId, Double score, int timeSpent) {
        LearnerProfile profile = learnerProfileRepository.findByUser_UserId(userId)
                .orElseThrow(() -> new RuntimeException("LearnerProfile not found"));

        // Convert Double to Integer if needed
        profile.setAvgScore(score != null ? score.intValue() : 0);
        profile.setTotalTimeSpent(profile.getTotalTimeSpent() + timeSpent);
        learnerProfileRepository.save(profile);
    }

    // NEW: Update quiz score method
    @Transactional
    public LearnerProfile updateQuizScore(Long userId, Integer avgScore) {
        LearnerProfile profile = learnerProfileRepository.findByUser_UserId(userId)
                .orElseThrow(() -> new RuntimeException("LearnerProfile not found"));

        profile.setAvgScore(avgScore);

        // Auto-set knowledge level based on score
        if (avgScore >= 70) {
            profile.setKnowledgeLevel("advanced");
        } else if (avgScore >= 40) {
            profile.setKnowledgeLevel("intermediate");
        } else {
            profile.setKnowledgeLevel("beginner");
        }

        return learnerProfileRepository.save(profile);
    }
}