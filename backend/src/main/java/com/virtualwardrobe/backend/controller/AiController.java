package com.virtualwardrobe.backend.controller;

import com.virtualwardrobe.backend.model.ClothingItem;
import com.virtualwardrobe.backend.service.ai.OutfitSuggestionService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AiController {

    private final OutfitSuggestionService outfitSuggestionService;

    @GetMapping("/suggest-outfit/{userId}")
    public List<ClothingItem> suggestOutfit(@PathVariable UUID userId) {
        return outfitSuggestionService.suggestOutfit(userId);
    }
}

