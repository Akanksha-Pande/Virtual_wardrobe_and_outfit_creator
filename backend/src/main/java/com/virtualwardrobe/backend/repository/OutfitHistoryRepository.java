package com.virtualwardrobe.backend.repository;

import com.virtualwardrobe.backend.model.OutfitHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface OutfitHistoryRepository extends JpaRepository<OutfitHistory, UUID> {
    List<OutfitHistory> findByOutfit_User_Id(UUID userId);
}
