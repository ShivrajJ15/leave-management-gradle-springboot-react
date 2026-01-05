package com.lms.dto;

import com.lms.enums.LeaveType;
import com.lms.model.LeaveBalance;

public record LeaveBalanceDTO(
        LeaveType type,
        int balance
) {
    public LeaveBalanceDTO(LeaveBalance balance) {
        this(balance.getType(), balance.getBalance());
    }
}
