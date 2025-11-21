package com.virtualwardrobe.backend.service;

import com.virtualwardrobe.backend.model.OutfitHistory;
import com.virtualwardrobe.backend.repository.OutfitHistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class OutfitHistoryService {
    private final OutfitHistoryRepository outfitHistoryRepository;

    public OutfitHistory save(OutfitHistory history) {
        return outfitHistoryRepository.save(history);
    }

    public List<OutfitHistory> findByUserId(UUID userId) {
        return outfitHistoryRepository.findByOutfit_User_Id(userId);
    }
}
