package com.smartcampus.resourcebooking.service;

import com.smartcampus.resourcebooking.repository.ResourceRepository;
import org.springframework.stereotype.Service;

@Service
public class ResourceService {

    private final ResourceRepository resourceRepository;

    public ResourceService(ResourceRepository resourceRepository) {
        this.resourceRepository = resourceRepository;
    }
}

