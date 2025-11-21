package com.virtualwardrobe.backend.dto;

import lombok.Data;
import java.util.UUID;

@Data
public class UserResponse {
    private UUID id;
    private String username;
    private String email;
    private String role;
    private String avatarUrl;
}
