package com.smartcampus.resourcebooking.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateResourceRequest {
    @NotBlank
    private String name;
    
    @NotNull
    private Long typeId;
    
    private Integer capacity;
    
    private Long parentId;
}

