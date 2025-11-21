package com.virtualwardrobe.backend.service;

import com.virtualwardrobe.backend.model.ClothingItem;
import com.virtualwardrobe.backend.repository.ClothingItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ClothingItemService {
    private final ClothingItemRepository clothingItemRepository;

    public ClothingItem save(ClothingItem item) {
        return clothingItemRepository.save(item);
    }

    public List<ClothingItem> findAllByUserId(UUID userId) {
        return clothingItemRepository.findAllByUserId(userId);
    }

    public void delete(UUID id) {
        clothingItemRepository.deleteById(id);
    }
}
