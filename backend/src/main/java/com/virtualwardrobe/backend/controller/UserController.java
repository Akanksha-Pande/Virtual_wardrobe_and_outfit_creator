package com.virtualwardrobe.backend.controller;

import com.virtualwardrobe.backend.dto.UserResponse;
import com.virtualwardrobe.backend.model.User;
import com.virtualwardrobe.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    private final UserService userService;

    @PostMapping("/signup")
    public ResponseEntity<UserResponse> signup(@RequestBody User signup) {
        User created = userService.signup(signup);
        UserResponse resp = new UserResponse();
        resp.setId(created.getId());
        resp.setUsername(created.getUsername());
        resp.setEmail(created.getEmail());
        resp.setAvatarUrl(created.getAvatarUrl());
        resp.setRole(created.getRole());
        return ResponseEntity.ok(resp);
    }

    @PostMapping("/login")
    public User login(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String password = body.get("password");
        Optional<User> user = userService.login(email, password);
        return user.orElseThrow(() -> new RuntimeException("Invalid credentials"));
    }
}
