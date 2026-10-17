package com.icecream.godown.service;

import com.icecream.godown.entity.User;
import com.icecream.godown.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class AdminSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final UserService userService;

    public AdminSeeder(
            UserRepository userRepository,
            UserService userService) {

        this.userRepository = userRepository;
        this.userService = userService;
    }

    @Override
    public void run(String... args) {

        if (userRepository.findByUsername("admin").isEmpty()) {

            User admin = new User();

            admin.setName("Administrator");
            admin.setUsername("admin");
            admin.setPassword("Admin@123");
            admin.setRole("ADMIN");

            userService.createUser(admin);

            System.out.println("Default Admin account created.");
        }
    }
}