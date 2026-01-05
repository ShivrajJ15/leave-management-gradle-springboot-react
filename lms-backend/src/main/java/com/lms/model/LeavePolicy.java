package com.lms.model;


import com.lms.enums.LeaveType;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import lombok.Data;

@Data
@Entity
public class LeavePolicy {
    @Id
    @Enumerated(EnumType.STRING)
    private LeaveType type;
    private int maxDays;
    private boolean carryOver;
    private int maxCarryOverDays;
}
