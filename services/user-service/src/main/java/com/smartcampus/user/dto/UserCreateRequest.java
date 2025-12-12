package com.smartcampus.user.dto;

import com.smartcampus.user.model.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserCreateRequest {
    @NotBlank
    private String username;
    @NotBlank
    private String fullName;
    @Email
    @NotBlank
    private String email;
    @NotNull
    private Role role;
}

