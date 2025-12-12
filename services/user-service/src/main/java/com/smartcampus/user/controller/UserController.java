package com.smartcampus.user.controller;

import com.smartcampus.user.dto.UserCreateRequest;
import com.smartcampus.user.dto.UserResponse;
import com.smartcampus.user.service.UserProfileService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserProfileService userProfileService;

    public UserController(UserProfileService userProfileService) {
        this.userProfileService = userProfileService;
    }

    @PostMapping
    public ResponseEntity<UserResponse> create(@Valid @RequestBody UserCreateRequest request) {
        return ResponseEntity.ok(userProfileService.create(request));
    }

    @GetMapping
    public ResponseEntity<List<UserResponse>> list() {
        return ResponseEntity.ok(userProfileService.listAll());
    }

    @GetMapping("/{username}")
    public ResponseEntity<UserResponse> get(@PathVariable String username) {
        return ResponseEntity.ok(userProfileService.getByUsername(username));
    }
}

