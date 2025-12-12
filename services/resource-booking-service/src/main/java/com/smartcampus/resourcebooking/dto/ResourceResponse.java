package com.smartcampus.resourcebooking.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ResourceResponse {
    private Long id;
    private Long typeId;
    private String typeName;
    private Long parentId;
    private String name;
    private Integer capacity;
}

