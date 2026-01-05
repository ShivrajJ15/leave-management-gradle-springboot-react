package com.lms.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.lms.enums.LeaveStatus;
import com.lms.enums.LeaveType;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Data
@Entity
@Table(name = "`leave`")  // Escape with backticks
public class Leave {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private LocalDate startDate;
    private LocalDate endDate;
    @Enumerated(EnumType.STRING)
    private LeaveType type; // CASUAL, SICK, MATERNITY, PTO
    private String reason;
    @Enumerated(EnumType.STRING)
    private LeaveStatus status; // PENDING, APPROVED, REJECTED, WITHDRAWN

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}