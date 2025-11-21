package com.virtualwardrobe.backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.UUID;

@Entity
@Table(name = "suggested_outfit")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class SuggestedOutfit {
    @Id @GeneratedValue
    private UUID id;

    @ManyToOne @JoinColumn(name = "suggestion_id")
    private OutfitSuggestion suggestion;

    @ManyToOne @JoinColumn(name = "clothing_items_id")
    private ClothingItem clothingItem;

    private String type;
}
