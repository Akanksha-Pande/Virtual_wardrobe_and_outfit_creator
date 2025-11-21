package com.virtualwardrobe.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import java.util.UUID;

@Entity
@Table(name = "clothing_items")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ClothingItem {
    @Id @GeneratedValue
    private UUID id;

    @Column(nullable = false)
    private String name;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "image_path", nullable = false)
    private String imagePath;

    private String category;
    private String colour;
    private String season;
    private String brand;
}
