package com.example.demo.security;

import com.example.demo.entity.Course;
import com.example.demo.entity.Lesson;
import com.example.demo.repository.CourseRepository;
import com.example.demo.repository.LessonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;

@Service
public class LessonService {

    private static final String UPLOAD_DIR = "uploads/";

    @Autowired
    private LessonRepository lessonRepository;

    @Autowired
    private CourseRepository courseRepository;

    // NEW: Updated method with YouTube support
    public Lesson createLesson(
            Long courseId,
            String lessonName,
            String lessonContent,
            MultipartFile pdf,
            MultipartFile video,
            String youtubeLink, // NEW parameter
            String videoSource // NEW parameter
    ) throws IOException {

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        Lesson lesson = new Lesson();
        lesson.setLessonName(lessonName);
        lesson.setLessonContent(lessonContent);
        lesson.setCourse(course);

        // NEW: Set YouTube link and video source
        lesson.setYoutubeLink(youtubeLink);
        lesson.setVideoSource(videoSource != null ? videoSource : "none");

        // Create upload directory if not exists
        File folder = new File(UPLOAD_DIR);
        if (!folder.exists()) folder.mkdirs();

        // PDF upload (unchanged)
        if (pdf != null && !pdf.isEmpty()) {
            String pdfFileName = System.currentTimeMillis() + "_" + pdf.getOriginalFilename();
            String pdfPath = UPLOAD_DIR + pdfFileName;
            pdf.transferTo(new File(pdfPath));
            lesson.setPdfPath(pdfPath);
        }

        // Video upload - ONLY if videoSource is "upload"
        if ("upload".equals(videoSource) && video != null && !video.isEmpty()) {
            String videoFileName = System.currentTimeMillis() + "_" + video.getOriginalFilename();
            String videoPath = UPLOAD_DIR + videoFileName;
            video.transferTo(new File(videoPath));
            lesson.setVideoPath(videoPath);
        } else {
            // Clear video path if not uploading
            lesson.setVideoPath(null);
        }

        return lessonRepository.save(lesson);
    }

    // NEW: Helper method to extract YouTube ID for embedding
    public static String extractYouTubeId(String youtubeLink) {
        if (youtubeLink == null || youtubeLink.trim().isEmpty()) {
            return null;
        }

        String videoId = null;
        String pattern = "(?<=watch\\?v=|/videos/|embed\\/|youtu.be\\/|\\/v\\/|\\/e\\/|watch\\?v%3D|watch\\?feature=player_embedded&v=|%2Fvideos%2F|embed%2F|youtu.be%2F|%2Fv%2F)[^#\\&\\?\\n]*";

        java.util.regex.Pattern compiledPattern = java.util.regex.Pattern.compile(pattern);
        java.util.regex.Matcher matcher = compiledPattern.matcher(youtubeLink);

        if (matcher.find()) {
            videoId = matcher.group();
        }

        return videoId;
    }
}