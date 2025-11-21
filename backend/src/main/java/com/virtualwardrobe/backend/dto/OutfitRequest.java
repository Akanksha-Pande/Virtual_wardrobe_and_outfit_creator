package com.virtualwardrobe.backend.dto;

import lombok.Data;
import java.util.List;
import java.util.UUID;

@Data
public class OutfitRequest {
    private String name;
    private UUID userId;
    private List<UUID> items;
}

