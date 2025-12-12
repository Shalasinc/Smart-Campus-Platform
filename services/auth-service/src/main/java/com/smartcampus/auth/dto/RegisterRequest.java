package com.smartcampus.auth.dto;

import com.smartcampus.auth.model.Role;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterRequest {
    @NotBlank
    private String username;
    @NotBlank
    private String password;
    @NotNull
    private Role role;

    // Optional tenant; defaults to "tenant-default" if not provided
    private String tenantId;
}

