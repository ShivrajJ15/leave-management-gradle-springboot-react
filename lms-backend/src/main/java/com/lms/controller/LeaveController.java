package com.lms.controller;

import com.lms.dto.LeaveRequestDTO;
import com.lms.model.Leave;
import com.lms.service.LeaveService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/leaves")
public class LeaveController {

    private final LeaveService leaveService;

    public LeaveController(LeaveService leaveService) {
        this.leaveService = leaveService;
    }

    @PostMapping("/apply")
    public ResponseEntity<?> applyLeave(@RequestBody LeaveRequestDTO request,
                                        Authentication authentication) {
        leaveService.applyLeave(request, authentication.getName());
        return ResponseEntity.ok("Leave request submitted successfully");
    }

    @GetMapping("/mine")
    public ResponseEntity<List<Leave>> getMyLeaves(Authentication authentication) {
        List<Leave> leaves = leaveService.getLeavesByUser(authentication.getName());
        return ResponseEntity.ok(leaves);
    }

    @PutMapping("/{id}/withdraw")
    public ResponseEntity<?> withdrawLeave(@PathVariable Long id,
                                           Authentication authentication) {
        leaveService.withdrawLeave(id, authentication.getName());
        return ResponseEntity.ok("Leave request withdrawn successfully");
    }
}