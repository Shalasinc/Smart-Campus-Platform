package com.smartcampus.resourcebooking.controller;

import com.smartcampus.resourcebooking.dto.CreateResourceRequest;
import com.smartcampus.resourcebooking.dto.ResourceResponse;
import com.smartcampus.resourcebooking.dto.ResourceTypeResponse;
import com.smartcampus.resourcebooking.entity.Resource;
import com.smartcampus.resourcebooking.entity.ResourceType;
import com.smartcampus.resourcebooking.service.ResourceService;
import jakarta.validation.Valid;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class ResourceController {

    private final ResourceService resourceService;

    public ResourceController(ResourceService resourceService) {
        this.resourceService = resourceService;
    }

    @GetMapping("/resources")
    public ResponseEntity<List<ResourceResponse>> listResources() {
        List<ResourceResponse> resources = resourceService.findAll().stream()
                .map(this::toResourceResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(resources);
    }

    @GetMapping("/resource-types")
    public ResponseEntity<List<ResourceTypeResponse>> listResourceTypes() {
        List<ResourceTypeResponse> types = resourceService.findAllTypes().stream()
                .map(this::toTypeResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(types);
    }

    @PostMapping("/resources")
    public ResponseEntity<ResourceResponse> create(@Valid @RequestBody CreateResourceRequest request) {
        Resource resource = resourceService.create(request);
        return ResponseEntity.ok(toResourceResponse(resource));
    }

    private ResourceResponse toResourceResponse(Resource resource) {
        return ResourceResponse.builder()
                .id(resource.getId())
                .name(resource.getName())
                .capacity(resource.getCapacity())
                .parentId(resource.getParent() != null ? resource.getParent().getId() : null)
                .typeId(resource.getType() != null ? resource.getType().getId() : null)
                .typeName(resource.getType() != null ? resource.getType().getName() : null)
                .build();
    }

    private ResourceTypeResponse toTypeResponse(ResourceType type) {
        return new ResourceTypeResponse(type.getId(), type.getName());
    }
}

