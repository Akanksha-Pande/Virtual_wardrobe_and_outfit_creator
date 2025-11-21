package com.virtualwardrobe.backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;
import java.util.*;

@Entity
@Table(name = "outfit_suggestions")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class OutfitSuggestion {
    @Id @GeneratedValue
    private UUID id;

    @ManyToOne @JoinColumn(name = "user_id")
    private User user;

    @Builder.Default
    private Instant createdAt = Instant.now();
}
