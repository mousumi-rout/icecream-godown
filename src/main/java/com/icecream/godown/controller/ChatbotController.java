package com.icecream.godown.controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.icecream.godown.service.ChatbotService;

import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api/chatbot")
@CrossOrigin(
        origins = "http://localhost:5173",
        allowCredentials = "true"
)
public class ChatbotController {

    private final ChatbotService chatbotService;

    public ChatbotController(ChatbotService chatbotService) {
        this.chatbotService = chatbotService;
    }

    @PostMapping
    public ResponseEntity<Map<String, String>> chat(
            @RequestBody Map<String, String> request,
            HttpSession session) {

        // Only logged-in users can use the chatbot
        if (session.getAttribute("userId") == null) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of(
                            "reply",
                            "Please log in to use the Inventory Assistant."
                    ));
        }

        String message = request.get("message");

        String reply = chatbotService.getReply(message);

        return ResponseEntity.ok(Map.of("reply", reply));
    }
}