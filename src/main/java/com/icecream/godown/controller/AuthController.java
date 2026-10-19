package com.icecream.godown.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.icecream.godown.dto.LoginRequest;
import com.icecream.godown.dto.LoginResponse;
import com.icecream.godown.service.UserService;

import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(
        origins = "http://localhost:5173",
        allowCredentials = "true"
)
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody LoginRequest request,
            HttpSession session) {

        return userService.findByUsername(request.getUsername())
                .map(user -> {

                    if (!userService.checkPassword(
                            request.getPassword(),
                            user.getPassword())) {

                        return ResponseEntity
                                .status(401)
                                .body("Invalid username or password");
                    }

                    // Block deactivated accounts
                    if (!user.isActive()) {
                        return ResponseEntity
                                .status(403)
                                .body("Your account has been deactivated. Please contact Admin.");
                    }

                    session.setAttribute("userId", user.getId());
                    session.setAttribute("username", user.getUsername());
                    session.setAttribute("role", user.getRole());

                    return ResponseEntity.ok(
                            new LoginResponse(
                                    user.getId(),
                                    user.getName(),
                                    user.getUsername(),
                                    user.getRole()
                            )
                    );
                })
                .orElse(
                        ResponseEntity
                                .status(401)
                                .body("Invalid username or password")
                );
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpSession session) {
        session.invalidate();
        return ResponseEntity.ok("Logged out successfully");
    }
}
