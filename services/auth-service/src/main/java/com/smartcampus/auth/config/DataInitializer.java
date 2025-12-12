package com.smartcampus.auth.config;

import com.smartcampus.auth.model.Role;
import com.smartcampus.auth.model.User;
import com.smartcampus.auth.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        // Create default admin user: amin / 1383
        if (!userRepository.existsByUsername("amin")) {
            User admin = User.builder()
                    .username("amin")
                    .password(passwordEncoder.encode("1383"))
                    .role(Role.ADMIN)
                    .tenantId("tenant-default")
                    .build();
            userRepository.save(admin);
            System.out.println("Default admin user created: amin / 1383");
        }
    }
}

