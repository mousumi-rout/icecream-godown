package com.icecream.godown.dto;

public class LoginResponse {

    private Long id;
    private String name;
    private String username;
    private String role;

    public LoginResponse(Long id, String name, String username, String role) {
        this.id = id;
        this.name = name;
        this.username = username;
        this.role = role;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getUsername() {
        return username;
    }

    public String getRole() {
        return role;
    }
}