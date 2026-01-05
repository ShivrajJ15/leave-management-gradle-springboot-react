package com.lms.dto;

import com.lms.enums.LeaveType;
import java.time.LocalDate;

public record LeaveRequestDTO(
        LocalDate startDate,
        LocalDate endDate,
        LeaveType type,
        String reason
) {}