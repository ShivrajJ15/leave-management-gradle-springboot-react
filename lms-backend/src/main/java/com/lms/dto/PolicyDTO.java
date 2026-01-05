package com.lms.dto;

import com.lms.enums.LeaveType;

public record PolicyDTO(
        LeaveType type,
        int maxDays,
        boolean carryOver,
        Integer maxCarryOverDays
) {}