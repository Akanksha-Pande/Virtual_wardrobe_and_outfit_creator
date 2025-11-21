package com.virtualwardrobe.backend.dto;

import com.virtualwardrobe.backend.model.Outfit;
import lombok.AllArgsConstructor;
import lombok.Data;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Data
@AllArgsConstructor
public class OutfitResponse {
    private UUID id;
    private String name;
    private Instant createdAt;
    private UUID userId;
    private List<ClothingItemResponse> items;

    public static OutfitResponse from(Outfit outfit) {
        return new OutfitResponse(
                outfit.getId(),
                outfit.getName(),
                outfit.getCreatedAt(),
                outfit.getUser().getId(),
                outfit.getItems().stream()
                        .map(ClothingItemResponse::from)
                        .collect(Collectors.toList())
        );
    }
}
