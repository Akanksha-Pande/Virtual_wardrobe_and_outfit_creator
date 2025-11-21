package com.virtualwardrobe.backend.service;

import com.virtualwardrobe.backend.dto.ClothingItemResponse;
import com.virtualwardrobe.backend.dto.OutfitRequest;
import com.virtualwardrobe.backend.dto.OutfitResponse;
import com.virtualwardrobe.backend.model.ClothingItem;
import com.virtualwardrobe.backend.model.Outfit;
import com.virtualwardrobe.backend.model.User;
import com.virtualwardrobe.backend.repository.ClothingItemRepository;
import com.virtualwardrobe.backend.repository.OutfitRepository;
import com.virtualwardrobe.backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OutfitService {
    private final OutfitRepository outfitRepository;
    private final UserRepository userRepository;
    private final ClothingItemRepository clothingItemRepository;

    public OutfitResponse save(OutfitRequest request) {
        if (request.getUserId() == null) {
            throw new IllegalArgumentException("User ID must not be null");
        }

        if (request.getItems() == null || request.getItems().isEmpty() || request.getItems().contains(null)) {
            throw new IllegalArgumentException("Item IDs must not be null or empty");
        }

        User user = userRepository.findById(request.getUserId())
            .orElseThrow(() -> new RuntimeException("User not found"));

        List<ClothingItem> items = clothingItemRepository.findAllById(request.getItems());

        Outfit outfit = Outfit.builder()
            .name(request.getName())
            .user(user)
            .items(items)
            .build();

        Outfit saved = outfitRepository.save(outfit);

        return new OutfitResponse(
            saved.getId(),
            saved.getName(),
            saved.getCreatedAt(),
            saved.getUser().getId(),
            saved.getItems().stream()
                .map(item -> new ClothingItemResponse(
                    item.getId(),
                    item.getName(),
                    item.getCategory(),
                    item.getColour(),
                    item.getImagePath(),
                    item.getBrand(),
                    item.getSeason(),
                    item.getUser() != null ? item.getUser().getId() : null
                ))
                .collect(Collectors.toList())
        );
    }

    public List<OutfitResponse> getUserOutfits(UUID userId) {
        return outfitRepository.findByUserId(userId).stream()
            .map(outfit -> new OutfitResponse(
                outfit.getId(),
                outfit.getName(),
                outfit.getCreatedAt(),
                outfit.getUser().getId(),
                outfit.getItems().stream()
                    .map(item -> new ClothingItemResponse(
                        item.getId(),
                        item.getName(),
                        item.getCategory(),
                        item.getColour(),
                        item.getImagePath(),
                        item.getBrand(),
                        item.getSeason(),
                        item.getUser() != null ? item.getUser().getId() : null
                    ))
                    .collect(Collectors.toList())
            ))
            .collect(Collectors.toList());
    }

    public void delete(UUID outfitId) {
        outfitRepository.deleteById(outfitId);
    }
}
