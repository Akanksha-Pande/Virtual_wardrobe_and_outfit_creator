package com.virtualwardrobe.backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "outfit_history")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class OutfitHistory {
    @Id @GeneratedValue
    private UUID id;

    @ManyToOne @JoinColumn(name = "outfit_id")
    private Outfit outfit;

    private LocalDate wornOn;
}
