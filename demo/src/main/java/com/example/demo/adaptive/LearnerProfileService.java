package com.example.demo.adaptive;

import com.example.demo.adaptive.LearnerProfile;
import com.example.demo.entity.User;
import com.example.demo.adaptive.LearnerProfileRepository;
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
                    profile.setAvgScore(0.0);
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
        profile.setAvgScore(score);
        profile.setTotalTimeSpent(profile.getTotalTimeSpent() + timeSpent);
        learnerProfileRepository.save(profile);
    }
}
