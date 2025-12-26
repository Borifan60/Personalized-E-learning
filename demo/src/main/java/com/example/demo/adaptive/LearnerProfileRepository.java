package com.example.demo.adaptive;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface LearnerProfileRepository extends JpaRepository<LearnerProfile, Long> {

    Optional<LearnerProfile> findByUser_UserId(Long userId);
}
