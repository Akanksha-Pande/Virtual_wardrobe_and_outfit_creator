package com.virtualwardrobe.backend.controller;

import com.virtualwardrobe.backend.dto.ClothingItemRequest;
import com.virtualwardrobe.backend.dto.ClothingItemResponse;
import com.virtualwardrobe.backend.model.ClothingItem;
import com.virtualwardrobe.backend.model.User;
import com.virtualwardrobe.backend.repository.UserRepository;
import com.virtualwardrobe.backend.service.ClothingItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/clothing")
@RequiredArgsConstructor
public class ClothingItemController {
    private final ClothingItemService clothingItemService;
    private final UserRepository userRepository;

    @PostMapping
    public ResponseEntity<?> addItem(@RequestBody ClothingItemRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        ClothingItem item = ClothingItem.builder()
                .name(request.getName())
                .category(request.getCategory())
                .colour(request.getColour())
                .imagePath(request.getImagePath())
                .brand(request.getBrand())
                .season(request.getSeason())
                .user(user)
                .build();

        ClothingItem saved = clothingItemService.save(item);

        return ResponseEntity.ok(saved);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ClothingItemResponse>> getUserItems(@PathVariable UUID userId) {
        List<ClothingItemResponse> items = clothingItemService.findAllByUserId(userId)
                .stream()
                .map(item -> new ClothingItemResponse(
                        item.getId(),
                        item.getName(),
                        item.getCategory(),
                        item.getColour(),
                        item.getImagePath(),
                        item.getBrand(),
                        item.getSeason(),
                        item.getUser().getId()
                ))
                .toList();
        return ResponseEntity.ok(items);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteItem(@PathVariable UUID id) {
        clothingItemService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
