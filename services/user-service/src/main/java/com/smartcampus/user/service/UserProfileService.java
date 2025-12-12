package com.smartcampus.user.service;

import com.smartcampus.user.dto.UserCreateRequest;
import com.smartcampus.user.dto.UserResponse;
import java.util.List;
import java.util.stream.Collectors;
import com.smartcampus.user.model.UserProfile;
import com.smartcampus.user.repository.UserProfileRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserProfileService {

    private final UserProfileRepository repository;

    public UserProfileService(UserProfileRepository repository) {
        this.repository = repository;
    }

    @Transactional
    public UserResponse create(UserCreateRequest request) {
        if (repository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }
        if (repository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        UserProfile profile = UserProfile.builder()
                .username(request.getUsername())
                .fullName(request.getFullName())
                .email(request.getEmail())
                .role(request.getRole())
                .build();
        UserProfile saved = repository.save(profile);
        return toResponse(saved);
    }

    public UserResponse getByUsername(String username) {
        UserProfile profile = repository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return toResponse(profile);
    }

    public List<UserResponse> listAll() {
        return repository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    private UserResponse toResponse(UserProfile profile) {
        return UserResponse.builder()
                .id(profile.getId())
                .username(profile.getUsername())
                .fullName(profile.getFullName())
                .email(profile.getEmail())
                .role(profile.getRole())
                .build();
    }
}

