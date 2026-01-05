package com.lms.dto;


import com.lms.enums.Role;
import com.lms.model.User;

import java.util.List;

public record UserDTO(
        Long id,
        String name,
        String email,
        Role role,
        List<LeaveBalanceDTO> leaveBalances
) {
    public UserDTO(User user) {
        this(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole(),
                user.getLeaveBalances().stream()
                        .map(LeaveBalanceDTO::new)
                        .toList()
        );
    }
}
