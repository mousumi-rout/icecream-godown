package com.icecream.godown.service;

import java.util.List;
import java.util.Optional;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.icecream.godown.entity.User;
import com.icecream.godown.repository.StockTransactionRepository;
import com.icecream.godown.repository.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final StockTransactionRepository stockTransactionRepository;

    private final BCryptPasswordEncoder passwordEncoder
            = new BCryptPasswordEncoder();

    public UserService(
            UserRepository userRepository,
            StockTransactionRepository stockTransactionRepository) {

        this.userRepository = userRepository;
        this.stockTransactionRepository = stockTransactionRepository;
    }

    // Create Labour Account
    public User createUser(User user) {

        user.setPassword(
                passwordEncoder.encode(user.getPassword())
        );

        return userRepository.save(user);
    }

    // Find User by Username
    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    // Get All Labour Accounts
    public List<User> getLabourUsers() {
        return userRepository.findByRole("LABOUR");
    }

    // Find User by ID
    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }

    // Update Labour Account
    public User updateLabour(
            Long id,
            String name,
            String username) {

        User labour = userRepository.findById(id)
                .orElseThrow(()
                        -> new RuntimeException(
                                "Labour account not found."
                        )
                );

        if (!"LABOUR".equals(labour.getRole())) {
            throw new IllegalArgumentException(
                    "Only labour accounts can be updated."
            );
        }

        Optional<User> existingUser
                = userRepository.findByUsername(username);

        if (existingUser.isPresent()
                && !existingUser.get().getId().equals(id)) {
            throw new IllegalArgumentException(
                    "Username already exists."
            );
        }

        labour.setName(name);
        labour.setUsername(username);

        return userRepository.save(labour);
    }

    public User setLabourActive(Long id, boolean active) {
        User labour = userRepository.findById(id)
                .orElseThrow(()
                        -> new RuntimeException("Labour account not found."));

        if (!"LABOUR".equals(labour.getRole())) {
            throw new IllegalArgumentException(
                    "Only labour accounts can be activated or deactivated.");
        }

        labour.setActive(active);

        return userRepository.save(labour);
    }

    // Delete Labour Account Safely
    public void deleteLabour(Long id) {

        User labour = userRepository.findById(id)
                .orElseThrow(()
                        -> new RuntimeException(
                                "Labour account not found."
                        )
                );

        if (!"LABOUR".equals(labour.getRole())) {
            throw new IllegalArgumentException(
                    "Only labour accounts can be deleted."
            );
        }

        // Preserve transaction history
        if (stockTransactionRepository.existsByPerformedById(id)) {
            throw new IllegalStateException(
                    "This labour has stock transaction history. "
                    + "The account cannot be permanently deleted."
            );
        }

        userRepository.delete(labour);
    }

    // Check Password
    public boolean checkPassword(
            String rawPassword,
            String encodedPassword) {

        return passwordEncoder.matches(
                rawPassword,
                encodedPassword
        );
    }
}
