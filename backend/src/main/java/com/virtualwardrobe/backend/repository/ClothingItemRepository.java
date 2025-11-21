package com.virtualwardrobe.backend.repository;

import com.virtualwardrobe.backend.model.ClothingItem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface ClothingItemRepository extends JpaRepository<ClothingItem, UUID> {
    List<ClothingItem> findAllByUserId(UUID userId);
}
