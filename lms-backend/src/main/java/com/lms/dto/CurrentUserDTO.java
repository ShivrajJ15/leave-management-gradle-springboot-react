package com.lms.dto;

import com.lms.model.LeaveBalance;

import java.util.List;

public record CurrentUserDTO(
        Long id,
        String name,
        String email,
        com.lms.enums.Role role,
        List<LeaveBalance> leaveBalances

) {}
