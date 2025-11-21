package com.virtualwardrobe.backend.dto;

import lombok.Data;
import java.util.UUID;

@Data
public class ClothingItemRequest {
    private String name;
    private String category;
    private String colour;
    private String imagePath;
    private String brand;
    private String season;
    private UUID userId;
}
