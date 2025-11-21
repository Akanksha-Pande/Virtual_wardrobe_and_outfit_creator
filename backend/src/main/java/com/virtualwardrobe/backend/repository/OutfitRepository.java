package com.virtualwardrobe.backend.repository;

import com.virtualwardrobe.backend.model.Outfit;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface OutfitRepository extends JpaRepository<Outfit, UUID> {

    @EntityGraph(attributePaths = "items")
    List<Outfit> findByUserId(UUID userId);
}

