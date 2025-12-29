package com.example.demo;

import com.example.demo.entity.Course;
import com.example.demo.entity.Lesson;
import com.example.demo.adaptive.LearnerProfile;
import com.example.demo.repository.*;
import com.example.demo.repository.CompletedRepository;
import com.example.demo.repository.LearnerProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/lessons")
@CrossOrigin(origins = "http://localhost:3000")
public class LessonController {

    @Autowired
    private LessonRepository lessonRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private LearnerProfileRepository learnerProfileRepository;

    @Autowired
    private CompletedRepository completedRepository;

    private static final String UPLOAD_DIR = "uploads/";

    // ====================== CREATE LESSON ======================
    @PostMapping("/create/{courseId}")
    public ResponseEntity<?> createLesson(
            @PathVariable Long courseId,
            @RequestParam("lessonName") String lessonName,
            @RequestParam("lessonContent") String lessonContent,
            @RequestParam(value = "pdf", required = false) MultipartFile pdf,
            @RequestParam(value = "video", required = false) MultipartFile video,
            @RequestParam(value = "youtubeLink", required = false) String youtubeLink,
            @RequestParam(value = "videoSource", defaultValue = "none") String videoSource,
            @RequestParam(value = "difficultyLevel", defaultValue = "beginner") String difficultyLevel
    ) throws IOException {

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        Lesson lesson = new Lesson();
        lesson.setLessonName(lessonName);
        lesson.setLessonContent(lessonContent);
        lesson.setCourse(course);
        lesson.setYoutubeLink(youtubeLink);
        lesson.setVideoSource(videoSource);
        lesson.setDifficultyLevel(difficultyLevel);

        Path uploadPath = Paths.get(UPLOAD_DIR).toAbsolutePath().normalize();
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        if (pdf != null && !pdf.isEmpty()) {
            String originalFileName = pdf.getOriginalFilename();
            String fileExtension = getFileExtension(originalFileName);
            String pdfFileName = UUID.randomUUID().toString() + (fileExtension.isEmpty() ? "" : "." + fileExtension);
            Path pdfPath = uploadPath.resolve(pdfFileName);
            pdf.transferTo(pdfPath.toFile());
            lesson.setPdfPath(pdfPath.toString());
        }

        if ("upload".equals(videoSource) && video != null && !video.isEmpty()) {
            String originalFileName = video.getOriginalFilename();
            String fileExtension = getFileExtension(originalFileName);
            String videoFileName = UUID.randomUUID().toString() + (fileExtension.isEmpty() ? "" : "." + fileExtension);
            Path videoPath = uploadPath.resolve(videoFileName);
            video.transferTo(videoPath.toFile());
            lesson.setVideoPath(videoPath.toString());
        } else {
            lesson.setVideoPath(null);
        }

        lessonRepository.save(lesson);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Lesson created successfully!");
        response.put("lessonId", lesson.getLessonId());
        response.put("lessonName", lesson.getLessonName());
        response.put("difficultyLevel", lesson.getDifficultyLevel());
        response.put("videoSource", lesson.getVideoSource());
        response.put("youtubeLink", lesson.getYoutubeLink());

        return ResponseEntity.ok(response);
    }

    // ====================== GET ALL LESSONS BY COURSE ======================
    @GetMapping("/course/{courseId}")
    public ResponseEntity<?> getLessonsByCourse(@PathVariable Long courseId) {
        List<Lesson> lessons = lessonRepository.findByCourse_CourseId(courseId);
        List<Map<String, Object>> response = lessons.stream()
                .map(this::toLessonDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    // ====================== GET SINGLE LESSON BY ID ======================
    @GetMapping("/{lessonId}")
    public ResponseEntity<?> getLessonById(@PathVariable Long lessonId) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new RuntimeException("Lesson not found"));
        return ResponseEntity.ok(toLessonDTO(lesson));
    }

    // ====================== UPDATE LESSON ======================
    @PutMapping("/{lessonId}")
    public ResponseEntity<?> updateLesson(
            @PathVariable Long lessonId,
            @RequestParam(value = "lessonName", required = false) String lessonName,
            @RequestParam(value = "lessonContent", required = false) String lessonContent,
            @RequestParam(value = "pdf", required = false) MultipartFile pdf,
            @RequestParam(value = "video", required = false) MultipartFile video,
            @RequestParam(value = "youtubeLink", required = false) String youtubeLink,
            @RequestParam(value = "videoSource", required = false) String videoSource,
            @RequestParam(value = "difficultyLevel", required = false) String difficultyLevel
    ) throws IOException {

        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new RuntimeException("Lesson not found"));

        if (lessonName != null && !lessonName.trim().isEmpty()) {
            lesson.setLessonName(lessonName);
        }

        if (lessonContent != null && !lessonContent.trim().isEmpty()) {
            lesson.setLessonContent(lessonContent);
        }

        if (youtubeLink != null) {
            lesson.setYoutubeLink(youtubeLink);
        }

        if (videoSource != null) {
            lesson.setVideoSource(videoSource);
            if ("youtube".equals(videoSource) || "none".equals(videoSource)) {
                lesson.setVideoPath(null);
            }
        }

        if (difficultyLevel != null) {
            lesson.setDifficultyLevel(difficultyLevel);
        }

        Path uploadPath = Paths.get(UPLOAD_DIR).toAbsolutePath().normalize();

        if (pdf != null && !pdf.isEmpty()) {
            String originalFileName = pdf.getOriginalFilename();
            String fileExtension = getFileExtension(originalFileName);
            String pdfFileName = UUID.randomUUID().toString() + (fileExtension.isEmpty() ? "" : "." + fileExtension);
            Path pdfPath = uploadPath.resolve(pdfFileName);
            pdf.transferTo(pdfPath.toFile());
            lesson.setPdfPath(pdfPath.toString());
        }

        if ("upload".equals(lesson.getVideoSource()) && video != null && !video.isEmpty()) {
            String originalFileName = video.getOriginalFilename();
            String fileExtension = getFileExtension(originalFileName);
            String videoFileName = UUID.randomUUID().toString() + (fileExtension.isEmpty() ? "" : "." + fileExtension);
            Path videoPath = uploadPath.resolve(videoFileName);
            video.transferTo(videoPath.toFile());
            lesson.setVideoPath(videoPath.toString());
        }

        lessonRepository.save(lesson);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Lesson updated successfully!");
        response.put("lessonId", lesson.getLessonId());
        response.put("difficultyLevel", lesson.getDifficultyLevel());
        response.put("videoSource", lesson.getVideoSource());
        response.put("youtubeLink", lesson.getYoutubeLink());

        return ResponseEntity.ok(response);
    }

    // ====================== DELETE LESSON ======================
    @DeleteMapping("/{lessonId}")
    public ResponseEntity<?> deleteLesson(@PathVariable Long lessonId) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new RuntimeException("Lesson not found"));

        try {
            if (lesson.getPdfPath() != null) {
                Files.deleteIfExists(Paths.get(lesson.getPdfPath()));
            }
            if (lesson.getVideoPath() != null) {
                Files.deleteIfExists(Paths.get(lesson.getVideoPath()));
            }
        } catch (IOException e) {
            System.err.println("Warning: Could not delete files: " + e.getMessage());
        }

        lessonRepository.delete(lesson);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Lesson deleted successfully!");
        return ResponseEntity.ok(response);
    }

    // ====================== ADAPTIVE LEARNING ENDPOINTS ======================

    @GetMapping("/personalized/{courseId}")
    public ResponseEntity<?> getPersonalizedLessons(
            @PathVariable Long courseId,
            Authentication authentication) {

        try {
            Long userId = getUserIdFromAuthentication(authentication);

            LearnerProfile profile = learnerProfileRepository.findByUser_UserId(userId)
                    .orElseGet(() -> createDefaultProfile(userId));

            String knowledgeLevel = profile.getKnowledgeLevel();
            List<Long> completedIds = completedRepository
                    .findCompletedLessonIdsByUserAndCourse(userId, courseId);

            List<Lesson> filteredLessons = lessonRepository
                    .findLessonsForKnowledgeLevel(courseId, knowledgeLevel);

            Map<String, Object> response = new HashMap<>();
            response.put("learnerLevel", knowledgeLevel);
            response.put("totalAvailable", filteredLessons.size());
            response.put("completedCount", completedIds.size());

            List<Map<String, Object>> beginnerLessons = new ArrayList<>();
            List<Map<String, Object>> intermediateLessons = new ArrayList<>();
            List<Map<String, Object>> advancedLessons = new ArrayList<>();

            for (Lesson lesson : filteredLessons) {
                Map<String, Object> lessonData = toLessonDTO(lesson);
                lessonData.put("completed", completedIds.contains(lesson.getLessonId()));

                switch (lesson.getDifficultyLevel()) {
                    case "beginner" -> beginnerLessons.add(lessonData);
                    case "intermediate" -> intermediateLessons.add(lessonData);
                    case "advanced" -> advancedLessons.add(lessonData);
                }
            }

            response.put("beginnerLessons", beginnerLessons);
            response.put("intermediateLessons", intermediateLessons);
            response.put("advancedLessons", advancedLessons);

            if (!beginnerLessons.isEmpty() && "beginner".equals(knowledgeLevel)) {
                response.put("recommendation", "Start with beginner lessons");
            } else if (!intermediateLessons.isEmpty() && "intermediate".equals(knowledgeLevel)) {
                response.put("recommendation", "Try intermediate lessons");
            } else if (!advancedLessons.isEmpty() && "advanced".equals(knowledgeLevel)) {
                response.put("recommendation", "Challenge yourself with advanced lessons");
            }

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Failed to load personalized lessons", "details", e.getMessage()));
        }
    }

    @GetMapping("/recommend-next/{courseId}")
    public ResponseEntity<?> recommendNextLesson(
            @PathVariable Long courseId,
            Authentication authentication) {

        Long userId = getUserIdFromAuthentication(authentication);

        LearnerProfile profile = learnerProfileRepository.findByUser_UserId(userId)
                .orElseGet(() -> createDefaultProfile(userId));

        List<Long> completedIds = completedRepository
                .findCompletedLessonIdsByUserAndCourse(userId, courseId);

        List<Lesson> recommended = lessonRepository.findByCourseAndDifficulty(
                courseId, profile.getKnowledgeLevel());

        List<Lesson> available = recommended.stream()
                .filter(lesson -> !completedIds.contains(lesson.getLessonId()))
                .collect(Collectors.toList());

        if (!available.isEmpty()) {
            Map<String, Object> response = new HashMap<>();
            response.put("lesson", toLessonDTO(available.get(0)));
            response.put("reason", "Matches your " + profile.getKnowledgeLevel() + " level");
            return ResponseEntity.ok(response);
        }

        if ("intermediate".equals(profile.getKnowledgeLevel())) {
            List<Lesson> beginnerLessons = lessonRepository.findByCourseAndDifficulty(courseId, "beginner");
            List<Lesson> beginnerAvailable = beginnerLessons.stream()
                    .filter(lesson -> !completedIds.contains(lesson.getLessonId()))
                    .collect(Collectors.toList());

            if (!beginnerAvailable.isEmpty()) {
                Map<String, Object> response = new HashMap<>();
                response.put("lesson", toLessonDTO(beginnerAvailable.get(0)));
                response.put("reason", "No intermediate lessons left, reviewing beginner");
                return ResponseEntity.ok(response);
            }
        }

        if ("beginner".equals(profile.getKnowledgeLevel())) {
            List<Lesson> intermediateLessons = lessonRepository.findByCourseAndDifficulty(courseId, "intermediate");
            List<Lesson> intermediateAvailable = intermediateLessons.stream()
                    .filter(lesson -> !completedIds.contains(lesson.getLessonId()))
                    .collect(Collectors.toList());

            if (!intermediateAvailable.isEmpty()) {
                Map<String, Object> response = new HashMap<>();
                response.put("lesson", toLessonDTO(intermediateAvailable.get(0)));
                response.put("reason", "Ready for a challenge? Try intermediate");
                return ResponseEntity.ok(response);
            }
        }

        return ResponseEntity.ok(Map.of("message", "No more lessons available at your level"));
    }

    @PostMapping("/update-level/{lessonId}")
    public ResponseEntity<?> updateKnowledgeLevel(
            @PathVariable Long lessonId,
            @RequestParam(defaultValue = "0") int score,
            Authentication authentication) {

        Long userId = getUserIdFromAuthentication(authentication);

        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new RuntimeException("Lesson not found"));

        LearnerProfile profile = learnerProfileRepository.findByUser_UserId(userId)
                .orElseGet(() -> createDefaultProfile(userId));

        String currentLevel = profile.getKnowledgeLevel() != null ? profile.getKnowledgeLevel() : "beginner";
        String lessonDifficulty = lesson.getDifficultyLevel();

        Map<String, Object> response = new HashMap<>();

        if (score >= 80) {
            if ("beginner".equals(currentLevel) && "intermediate".equals(lessonDifficulty)) {
                profile.setKnowledgeLevel("intermediate");
                response.put("levelUp", true);
                response.put("message", "Congratulations! You've reached Intermediate level!");
            } else if ("intermediate".equals(currentLevel) && "advanced".equals(lessonDifficulty)) {
                profile.setKnowledgeLevel("advanced");
                response.put("levelUp", true);
                response.put("message", "Amazing! You've reached Advanced level!");
            }
        }

        if (score < 50 && !"beginner".equals(currentLevel)) {
            profile.setKnowledgeLevel("beginner");
            response.put("levelAdjustment", true);
            response.put("message", "Let's strengthen fundamentals at Beginner level");
        }

        // Update average score
        int totalLessons = profile.getTotalLessonsCompleted() != null ? profile.getTotalLessonsCompleted() : 0;
        int currentAvg = profile.getAvgScore() != null ? profile.getAvgScore() : 0;

        int newAvg = totalLessons > 0 ? ((currentAvg * totalLessons) + score) / (totalLessons + 1) : score;
        profile.setAvgScore(newAvg);
        profile.setTotalLessonsCompleted(totalLessons + 1);

        learnerProfileRepository.save(profile);

        response.put("currentLevel", profile.getKnowledgeLevel());
        response.put("averageScore", profile.getAvgScore());
        response.put("totalLessonsCompleted", profile.getTotalLessonsCompleted());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/recommended/{userId}/{courseId}")
    public ResponseEntity<?> getRecommendedLessons(
            @PathVariable Long userId,
            @PathVariable Long courseId) {
        List<Lesson> lessons = lessonRepository.findRecommendedLessons(userId, courseId);
        List<Map<String, Object>> response = lessons.stream()
                .map(this::toLessonDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/recommended-native/{userId}/{courseId}")
    public ResponseEntity<?> getRecommendedLessonsNative(
            @PathVariable Long userId,
            @PathVariable Long courseId) {
        List<Lesson> lessons = lessonRepository.findRecommendedLessonsNative(userId, courseId);
        List<Map<String, Object>> response = lessons.stream()
                .map(this::toLessonDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    // ====================== HELPER METHODS ======================

    private Long getUserIdFromAuthentication(Authentication authentication) {
        // TODO: Replace with your actual authentication logic
        // For now, return a default user ID
        if (authentication != null && authentication.isAuthenticated()) {
            // Example: return ((CustomUserDetails) authentication.getPrincipal()).getId();
            return 51L; // Your existing user ID from the database
        }
        return 51L; // Default for testing
    }

    private LearnerProfile createDefaultProfile(Long userId) {
        // This is a simplified version - you need to create a User object
        // For now, create profile without user (you'll need to fix this based on your User entity)
        LearnerProfile profile = new LearnerProfile();
        // profile.setUser(user); // You need to get the User entity by userId
        profile.setKnowledgeLevel("beginner");
        profile.setAvgScore(0);
        profile.setTotalLessonsCompleted(0);
        return learnerProfileRepository.save(profile);
    }

    private Map<String, Object> toLessonDTO(Lesson lesson) {
        Map<String, Object> dto = new HashMap<>();
        dto.put("lessonId", lesson.getLessonId());
        dto.put("lessonName", lesson.getLessonName());
        dto.put("lessonContent", lesson.getLessonContent());
        dto.put("pdfPath", lesson.getPdfPath());
        dto.put("videoPath", lesson.getVideoPath());
        dto.put("youtubeLink", lesson.getYoutubeLink());
        dto.put("videoSource", lesson.getVideoSource());
        dto.put("difficultyLevel", lesson.getDifficultyLevel());
        dto.put("courseId", lesson.getCourse() != null ? lesson.getCourse().getCourseId() : null);
        return dto;
    }

    private String getFileExtension(String fileName) {
        if (fileName == null || fileName.lastIndexOf(".") == -1) {
            return "";
        }
        return fileName.substring(fileName.lastIndexOf(".") + 1);
    }
}