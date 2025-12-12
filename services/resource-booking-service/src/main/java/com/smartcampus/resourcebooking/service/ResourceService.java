package com.smartcampus.resourcebooking.service;

import com.smartcampus.resourcebooking.entity.Resource;
import com.smartcampus.resourcebooking.entity.ResourceType;
import com.smartcampus.resourcebooking.repository.ResourceRepository;
import com.smartcampus.resourcebooking.repository.ResourceTypeRepository;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ResourceService {

    private final ResourceRepository resourceRepository;
    private final ResourceTypeRepository resourceTypeRepository;

    public ResourceService(ResourceRepository resourceRepository, ResourceTypeRepository resourceTypeRepository) {
        this.resourceRepository = resourceRepository;
        this.resourceTypeRepository = resourceTypeRepository;
    }

    public List<Resource> findAll() {
        return resourceRepository.findAll();
    }

    public List<ResourceType> findAllTypes() {
        return resourceTypeRepository.findAll();
    }

    @Transactional
    @CircuitBreaker(name = "bookingBreaker", fallbackMethod = "fallbackCreate")
    public Resource create(com.smartcampus.resourcebooking.dto.CreateResourceRequest request) {
        ResourceType type = resourceTypeRepository.findById(request.getTypeId())
                .orElseThrow(() -> new RuntimeException("Resource type not found"));
        
        Resource resource = new Resource();
        resource.setName(request.getName());
        resource.setType(type);
        resource.setCapacity(request.getCapacity());
        
        if (request.getParentId() != null) {
            Resource parent = resourceRepository.findById(request.getParentId())
                    .orElseThrow(() -> new RuntimeException("Parent resource not found"));
            resource.setParent(parent);
        }
        
        return resourceRepository.save(resource);
    }

    public Resource fallbackCreate(com.smartcampus.resourcebooking.dto.CreateResourceRequest request, Throwable ex) {
        throw new RuntimeException("Resource service temporarily unavailable: " + ex.getMessage());
    }

}

