package com.lms.controller;

import com.lms.dto.PolicyDTO;
import com.lms.service.PolicyService;
import com.lms.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
//@RequestMapping("/api/v1/admin")
@RequestMapping("/api/v1/admin")
public class AdminController {

    private final UserService userService;
    private final PolicyService policyService;

    public AdminController(UserService userService, PolicyService policyService) {
        this.userService = userService;
        this.policyService = policyService;
    }

    @PutMapping("/users/{userId}/manager")
    public ResponseEntity<?> changeManager(@PathVariable Long userId,
                                           @RequestBody Map<String, Long> payload) {
        userService.changeManager(userId, payload.get("managerId"));
        return ResponseEntity.ok("Manager updated successfully");
    }

    @PostMapping("/policies")
    public ResponseEntity<?> createPolicy(@RequestBody PolicyDTO policy) {
        policyService.createOrUpdatePolicy(policy);
        return ResponseEntity.ok("Policy created/updated successfully");
    }

    @GetMapping("/policies")
    public ResponseEntity<?> getAll() {
        policyService.getAllPolicies();
        return ResponseEntity.ok( policyService.getAllPolicies());
    }

    @PutMapping("/users/{userId}/adjust-leave-balance")
    public ResponseEntity<?> adjustBalance(@PathVariable Long userId,
                                           @RequestBody Map<String, Object> payload) {
        // Implementation would go here
        return ResponseEntity.ok("Leave balance adjusted successfully");
    }
}