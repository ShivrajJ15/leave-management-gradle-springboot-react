package com.lms.controller;

import com.lms.enums.LeaveStatus;
import com.lms.service.LeaveService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/manager")
public class ManagerController {

    private final LeaveService leaveService;

    public ManagerController(LeaveService leaveService) {
        this.leaveService = leaveService;
    }

    @PutMapping("/leaves/{id}/approve")
    public ResponseEntity<?> approveLeave(@PathVariable Long id,
                                          Authentication authentication) {
        leaveService.updateLeaveStatus(id, LeaveStatus.APPROVED, authentication.getName());
        return ResponseEntity.ok("Leave approved successfully");
    }

    @PutMapping("/leaves/{id}/reject")
    public ResponseEntity<?> rejectLeave(@PathVariable Long id,
                                         Authentication authentication) {
        leaveService.updateLeaveStatus(id, LeaveStatus.REJECTED, authentication.getName());
        return ResponseEntity.ok("Leave rejected successfully");
    }
}