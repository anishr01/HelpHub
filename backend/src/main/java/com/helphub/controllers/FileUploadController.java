package com.helphub.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.util.StringUtils;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;
import java.util.Map;

@RestController
@RequestMapping("/api/upload")
public class FileUploadController {

    private final String UPLOAD_DIR = "uploads/";

    @PostMapping
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("Please select a file to upload.");
        }

        try {
            // Create uploads directory if it doesn't exist
            Path uploadPath = Paths.get(UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Generate unique filename
            String originalFileName = StringUtils.cleanPath(file.getOriginalFilename());
            String extension = "";
            if (originalFileName.contains(".")) {
                extension = originalFileName.substring(originalFileName.lastIndexOf("."));
            }
            String uniqueFileName = UUID.randomUUID().toString() + extension;

            // Save file locally
            Path filePath = uploadPath.resolve(uniqueFileName);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // Return the publicly accessible URL
            String fileUrl = "http://localhost:8081/uploads/" + uniqueFileName;
            return ResponseEntity.ok(Map.of("imageUrl", fileUrl));

        } catch (IOException e) {
            return ResponseEntity.internalServerError().body("Could not upload the file: " + e.getMessage());
        }
    }
}
