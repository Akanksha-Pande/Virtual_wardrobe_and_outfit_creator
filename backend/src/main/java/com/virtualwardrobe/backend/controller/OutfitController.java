package com.virtualwardrobe.backend.controller;

import com.virtualwardrobe.backend.dto.OutfitRequest;
import com.virtualwardrobe.backend.dto.OutfitResponse;
import com.virtualwardrobe.backend.service.OutfitService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/outfits")
@RequiredArgsConstructor
public class OutfitController {
    private final OutfitService outfitService;

    @PostMapping
    public ResponseEntity<OutfitResponse> createOutfit(@RequestBody OutfitRequest request) {
        OutfitResponse saved = outfitService.save(request);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<OutfitResponse>> getUserOutfits(@PathVariable UUID userId) {
        List<OutfitResponse> outfits = outfitService.getUserOutfits(userId);
        return ResponseEntity.ok(outfits);
    }

    @DeleteMapping("/{outfitId}")
    public ResponseEntity<Void> deleteOutfit(@PathVariable UUID outfitId) {
        outfitService.delete(outfitId);
        return ResponseEntity.noContent().build();
    }
}
