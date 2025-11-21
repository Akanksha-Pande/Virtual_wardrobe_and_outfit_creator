package com.virtualwardrobe.backend.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.Map;

@Service
public class ImageService {
    private final Cloudinary cloudinary;

    public ImageService(Cloudinary cloudinary) { this.cloudinary = cloudinary; }

    public String upload(MultipartFile file, String folder) throws IOException {
        Map<?,?> result = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap("folder", folder));
        return (String) result.get("secure_url");
    }
}
