package com.lms.service;

import com.lms.enums.Role;
import com.lms.exception.ResourceNotFoundException;
import com.lms.model.User;
import com.lms.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public void register(User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);
    }

    public void changeManager(Long userId, Long managerId) {
        User employee = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        User manager = userRepository.findById(managerId)
                .orElseThrow(() -> new RuntimeException("Manager not found"));

        if (manager.getRole() != Role.MANAGER) {
            throw new RuntimeException("Specified user is not a manager");
        }

        employee.setManager(manager);
        userRepository.save(employee);
    }

    // Get authenticated user

    public User getCurrentUser() {
        var authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()
                || authentication.getPrincipal().equals("anonymousUser")) {
            throw new RuntimeException("Unauthenticated access");
        }

        String email = switch (authentication.getPrincipal()) {
            case UserDetails userDetails -> userDetails.getUsername(); // Assuming username is email
            case String str -> str;
            default -> throw new IllegalStateException("Unexpected principal type: " + authentication.getPrincipal());
        };

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));



        return user;
    }

    // Get user by email
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    // Get manager's team
    public List<User> getTeamByManager(User manager) {
        return userRepository.findByManager(manager);
    }

    // Get user by ID
    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
}