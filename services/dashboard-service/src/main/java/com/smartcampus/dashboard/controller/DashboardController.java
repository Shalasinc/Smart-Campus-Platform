package com.smartcampus.dashboard.controller;

import java.util.HashMap;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @GetMapping
    public ResponseEntity<Map<String, Object>> summary() {
        // placeholder static summary
        Map<String, Object> data = new HashMap<>();
        data.put("status", "ok");
        data.put("message", "Dashboard placeholder");
        data.put("version", "v1");

        return ResponseEntity.ok(data);
    }
}

