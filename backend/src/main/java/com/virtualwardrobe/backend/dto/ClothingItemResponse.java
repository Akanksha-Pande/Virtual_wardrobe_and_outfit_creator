package com.virtualwardrobe.backend.dto;

import com.virtualwardrobe.backend.model.ClothingItem;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.UUID;

@Data
@AllArgsConstructor
public class ClothingItemResponse {
    private UUID id;
    private String name;
    private String category;
    private String colour;
    private String imagePath;
    private String brand;
    private String season;
    private UUID userId;

    public static ClothingItemResponse from(ClothingItem item) {
        return new ClothingItemResponse(
                item.getId(),
                item.getName(),
                item.getCategory(),
                item.getColour(),
                item.getImagePath(),
                item.getBrand(),
                item.getSeason(),
                item.getUser() != null ? item.getUser().getId() : null
        );
    }
}

