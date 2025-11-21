package com.virtualwardrobe.backend.controller;

import com.virtualwardrobe.backend.model.OutfitHistory;
import com.virtualwardrobe.backend.service.OutfitHistoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/history")
@RequiredArgsConstructor
public class OutfitHistoryController {
    private final OutfitHistoryService outfitHistoryService;

    @PostMapping
    public ResponseEntity<OutfitHistory> addHistory(@RequestBody OutfitHistory history) {
        return ResponseEntity.ok(outfitHistoryService.save(history));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<OutfitHistory>> getUserHistory(@PathVariable UUID userId) {
        return ResponseEntity.ok(outfitHistoryService.findByUserId(userId));
    }
}
