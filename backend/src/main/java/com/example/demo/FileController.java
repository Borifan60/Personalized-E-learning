package com.example.demo;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping("/files")
@CrossOrigin(origins = "http://localhost:3000")
public class FileController {

    @Value("${file.upload-dir:uploads}")
    private String uploadDir;

    // Serve PDF file
    @GetMapping("/pdf/{filename:.+}")
    public ResponseEntity<Resource> getPdfFile(@PathVariable String filename) {
        return getFileResponse(filename, "application/pdf");
    }

    // Serve Video file
    @GetMapping("/video/{filename:.+}")
    public ResponseEntity<Resource> getVideoFile(@PathVariable String filename) {
        return getFileResponse(filename, "video/mp4");
    }

    private ResponseEntity<Resource> getFileResponse(String filename, String contentType) {
        try {
            Path filePath = Paths.get(uploadDir).resolve(filename).normalize();
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists() && resource.isReadable()) {
                return ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(contentType))
                        .header(HttpHeaders.CONTENT_DISPOSITION,
                                "inline; filename=\"" + resource.getFilename() + "\"")
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
