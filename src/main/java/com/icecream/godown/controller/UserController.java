package com.icecream.godown.controller;

import com.icecream.godown.entity.User;
import com.icecream.godown.service.UserService;

import jakarta.servlet.http.HttpSession;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(
    origins = "http://localhost:5173",
    allowCredentials = "true"
)
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // Create Labour account - ADMIN ONLY
    @PostMapping
    public ResponseEntity<?> createUser(
            @RequestBody User user,
            HttpSession session) {

        String role = (String) session.getAttribute("role");

        if (!"ADMIN".equals(role)) {
            return ResponseEntity
                    .status(403)
                    .body("Only Admin can create users.");
        }

        // Every account created through this endpoint will be LABOUR
        user.setRole("LABOUR");

        return ResponseEntity.ok(
                userService.createUser(user)
        );
    }

    // Get user by username
    @GetMapping("/username/{username}")
    public ResponseEntity<User> getUserByUsername(
            @PathVariable String username) {

        return userService.findByUsername(username)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Get all Labour users - ADMIN ONLY
    @GetMapping("/labours")
    public ResponseEntity<?> getLabourUsers(
            HttpSession session) {

        String role = (String) session.getAttribute("role");

        if (!"ADMIN".equals(role)) {
            return ResponseEntity
                    .status(403)
                    .body("Only Admin can view Labour users.");
        }

        return ResponseEntity.ok(
                userService.getLabourUsers()
        );
    }
}