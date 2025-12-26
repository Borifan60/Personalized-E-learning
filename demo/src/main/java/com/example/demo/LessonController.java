package com.example.demo;

import com.example.demo.entity.Course;
import com.example.demo.entity.Lesson;
import com.example.demo.repository.CourseRepository;
import com.example.demo.repository.LessonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/lessons")
@CrossOrigin(origins = "http://localhost:3000")
public class LessonController {

    @Autowired
    private LessonRepository lessonRepository;

    @Autowired
    private CourseRepository courseRepository;

    private static final String UPLOAD_DIR = "uploads/";

    // ---------------------- CREATE LESSON (UPDATED FOR YOUTUBE) -----------------------
    @PostMapping("/create/{courseId}")
    public ResponseEntity<?> createLesson(
            @PathVariable Long courseId,
            @RequestParam("lessonName") String lessonName,
            @RequestParam("lessonContent") String lessonContent,
            @RequestParam(value = "pdf", required = false) MultipartFile pdf,
            @RequestParam(value = "video", required = false) MultipartFile video,
            @RequestParam(value = "youtubeLink", required = false) String youtubeLink, // NEW
            @RequestParam(value = "videoSource", defaultValue = "none") String videoSource // NEW
    ) throws IOException {

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        Lesson lesson = new Lesson();
        lesson.setLessonName(lessonName);
        lesson.setLessonContent(lessonContent);
        lesson.setCourse(course);

        // NEW: Set YouTube link and video source
        lesson.setYoutubeLink(youtubeLink);
        lesson.setVideoSource(videoSource);

        // Create upload directory if not exists
        Path uploadPath = Paths.get(UPLOAD_DIR).toAbsolutePath().normalize();
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // ----- Handle PDF Upload -----
        if (pdf != null && !pdf.isEmpty()) {
            String originalFileName = pdf.getOriginalFilename();
            String fileExtension = getFileExtension(originalFileName);
            String pdfFileName = UUID.randomUUID().toString() + (fileExtension.isEmpty() ? "" : "." + fileExtension);
            Path pdfPath = uploadPath.resolve(pdfFileName);

            pdf.transferTo(pdfPath.toFile());
            lesson.setPdfPath(pdfPath.toString());
        }

        // ----- Handle Video Upload (ONLY if videoSource is "upload") -----
        if ("upload".equals(videoSource) && video != null && !video.isEmpty()) {
            String originalFileName = video.getOriginalFilename();
            String fileExtension = getFileExtension(originalFileName);
            String videoFileName = UUID.randomUUID().toString() + (fileExtension.isEmpty() ? "" : "." + fileExtension);
            Path videoPath = uploadPath.resolve(videoFileName);

            video.transferTo(videoPath.toFile());
            lesson.setVideoPath(videoPath.toString());
        } else {
            // Clear video path if not uploading
            lesson.setVideoPath(null);
        }

        lessonRepository.save(lesson);

        // Create response with Map
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Lesson created successfully!");
        response.put("lessonId", lesson.getLessonId());
        response.put("lessonName", lesson.getLessonName());
        response.put("videoSource", lesson.getVideoSource()); // NEW
        response.put("youtubeLink", lesson.getYoutubeLink()); // NEW

        return ResponseEntity.ok(response);
    }

    // Helper method to get file extension (unchanged)
    private String getFileExtension(String fileName) {
        if (fileName == null || fileName.lastIndexOf(".") == -1) {
            return "";
        }
        return fileName.substring(fileName.lastIndexOf(".") + 1);
    }

    // ---------------------- GET ALL LESSONS BY COURSE -----------------------
    @GetMapping("/course/{courseId}")
    public List<Lesson> getLessonsByCourse(@PathVariable Long courseId) {
        return lessonRepository.findByCourse_CourseId(courseId);
    }

    // ---------------------- GET SINGLE LESSON BY ID (UPDATED) -----------------------
    @GetMapping("/{lessonId}")
    public ResponseEntity<?> getLessonById(@PathVariable Long lessonId) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new RuntimeException("Lesson not found"));

        Map<String, Object> response = new HashMap<>();
        response.put("lessonId", lesson.getLessonId());
        response.put("lessonName", lesson.getLessonName());
        response.put("lessonContent", lesson.getLessonContent());
        response.put("pdfPath", lesson.getPdfPath());
        response.put("videoPath", lesson.getVideoPath());
        response.put("youtubeLink", lesson.getYoutubeLink()); // NEW
        response.put("videoSource", lesson.getVideoSource()); // NEW

        return ResponseEntity.ok(response);
    }

    // ---------------------- UPDATE LESSON (UPDATED FOR YOUTUBE) -----------------------
    @PutMapping("/{lessonId}")
    public ResponseEntity<?> updateLesson(
            @PathVariable Long lessonId,
            @RequestParam(value = "lessonName", required = false) String lessonName,
            @RequestParam(value = "lessonContent", required = false) String lessonContent,
            @RequestParam(value = "pdf", required = false) MultipartFile pdf,
            @RequestParam(value = "video", required = false) MultipartFile video,
            @RequestParam(value = "youtubeLink", required = false) String youtubeLink, // NEW
            @RequestParam(value = "videoSource", required = false) String videoSource // NEW
    ) throws IOException {

        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new RuntimeException("Lesson not found"));

        if (lessonName != null && !lessonName.trim().isEmpty()) {
            lesson.setLessonName(lessonName);
        }

        if (lessonContent != null && !lessonContent.trim().isEmpty()) {
            lesson.setLessonContent(lessonContent);
        }

        // NEW: Update YouTube link and video source
        if (youtubeLink != null) {
            lesson.setYoutubeLink(youtubeLink);
        }

        if (videoSource != null) {
            lesson.setVideoSource(videoSource);

            // If switching to YouTube, clear video path
            if ("youtube".equals(videoSource) || "none".equals(videoSource)) {
                lesson.setVideoPath(null);
            }
        }

        // Handle file updates
        Path uploadPath = Paths.get(UPLOAD_DIR).toAbsolutePath().normalize();

        if (pdf != null && !pdf.isEmpty()) {
            String originalFileName = pdf.getOriginalFilename();
            String fileExtension = getFileExtension(originalFileName);
            String pdfFileName = UUID.randomUUID().toString() + (fileExtension.isEmpty() ? "" : "." + fileExtension);
            Path pdfPath = uploadPath.resolve(pdfFileName);

            pdf.transferTo(pdfPath.toFile());
            lesson.setPdfPath(pdfPath.toString());
        }

        // Video upload - ONLY if videoSource is "upload"
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
        response.put("videoSource", lesson.getVideoSource()); // NEW
        response.put("youtubeLink", lesson.getYoutubeLink()); // NEW

        return ResponseEntity.ok(response);
    }

    // ---------------------- DELETE LESSON -----------------------
    @DeleteMapping("/{lessonId}")
    public ResponseEntity<?> deleteLesson(@PathVariable Long lessonId) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new RuntimeException("Lesson not found"));

        // Optional: Delete the files from disk
        try {
            if (lesson.getPdfPath() != null) {
                Files.deleteIfExists(Paths.get(lesson.getPdfPath()));
            }
            if (lesson.getVideoPath() != null) {
                Files.deleteIfExists(Paths.get(lesson.getVideoPath()));
            }
        } catch (IOException e) {
            // Log warning but continue with deletion
            System.err.println("Warning: Could not delete files: " + e.getMessage());
        }

        lessonRepository.delete(lesson);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Lesson deleted successfully!");

        return ResponseEntity.ok(response);
    }
}