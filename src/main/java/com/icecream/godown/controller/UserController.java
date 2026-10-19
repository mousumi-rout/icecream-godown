package com.icecream.godown.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.icecream.godown.entity.User;
import com.icecream.godown.service.UserService;

import jakarta.servlet.http.HttpSession;

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

    // Create Labour Account - ADMIN ONLY
    @PostMapping
    public ResponseEntity<?> createUser(
            @RequestBody User user,
            HttpSession session) {

        String role = (String) session.getAttribute("role");

        if (!"ADMIN".equals(role)) {
            return ResponseEntity.status(403)
                    .body("Only Admin can create users.");
        }

        user.setRole("LABOUR");

        return ResponseEntity.ok(
                userService.createUser(user)
        );
    }

    // Get User by Username
    @GetMapping("/username/{username}")
    public ResponseEntity<User> getUserByUsername(
            @PathVariable String username) {

        return userService.findByUsername(username)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Get All Labour Users - ADMIN ONLY
    @GetMapping("/labours")
    public ResponseEntity<?> getLabourUsers(
            HttpSession session) {

        String role = (String) session.getAttribute("role");

        if (!"ADMIN".equals(role)) {
            return ResponseEntity.status(403)
                    .body("Only Admin can view Labour users.");
        }

        return ResponseEntity.ok(
                userService.getLabourUsers()
        );
    }

    // Update Labour Account - ADMIN ONLY
    @PutMapping("/labours/{id}")
    public ResponseEntity<?> updateLabour(
            @PathVariable Long id,
            @RequestBody User request,
            HttpSession session) {

        String role = (String) session.getAttribute("role");

        if (!"ADMIN".equals(role)) {
            return ResponseEntity.status(403)
                    .body("Only Admin can update labour accounts.");
        }

        if (request.getName() == null
                || request.getName().isBlank()
                || request.getUsername() == null
                || request.getUsername().isBlank()) {
            return ResponseEntity.badRequest()
                    .body("Name and username are required.");
        }

        try {
            User updatedLabour = userService.updateLabour(
                    id,
                    request.getName().trim(),
                    request.getUsername().trim()
            );

            return ResponseEntity.ok(updatedLabour);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());

        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }

    @PutMapping("/labours/{id}/status")
    public ResponseEntity<?> updateLabourStatus(
            @PathVariable Long id,
            @RequestParam boolean active,
            HttpSession session) {

        String role = (String) session.getAttribute("role");

        if (!"ADMIN".equals(role)) {
            return ResponseEntity.status(403)
                    .body("Only Admin can change labour account status.");
        }

        try {
            User labour = userService.setLabourActive(id, active);

            String message = active
                    ? "Labour account activated successfully."
                    : "Labour account deactivated successfully.";

            return ResponseEntity.ok(message);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());

        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }

    // Delete Labour Account - ADMIN ONLY
    @DeleteMapping("/labours/{id}")
    public ResponseEntity<?> deleteLabour(
            @PathVariable Long id,
            HttpSession session) {

        String role = (String) session.getAttribute("role");

        if (!"ADMIN".equals(role)) {
            return ResponseEntity.status(403)
                    .body("Only Admin can delete labour accounts.");
        }

        try {
            userService.deleteLabour(id);

            return ResponseEntity.ok(
                    "Labour account deleted successfully."
            );

        } catch (IllegalStateException e) {
            return ResponseEntity.status(409).body(e.getMessage());

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());

        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }
}
