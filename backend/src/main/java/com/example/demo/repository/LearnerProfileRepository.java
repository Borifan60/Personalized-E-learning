package com.example.demo.repository;

import com.example.demo.adaptive.LearnerProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.Optional;

public interface LearnerProfileRepository extends JpaRepository<LearnerProfile, Long> {

    // Existing method (if any)...

    // NEW: Find by user ID
    @Query("SELECT lp FROM LearnerProfile lp WHERE lp.user.userId = :userId")
    Optional<LearnerProfile> findByUserId(@Param("userId") Long userId);

    // Alternative if you prefer method name query
    Optional<LearnerProfile> findByUser_UserId(Long userId);
}