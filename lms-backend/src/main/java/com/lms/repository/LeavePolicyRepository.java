package com.lms.repository;

import com.lms.model.LeavePolicy;
import com.lms.enums.LeaveType;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface LeavePolicyRepository extends JpaRepository<LeavePolicy, LeaveType> {
    Optional<LeavePolicy> findByType(LeaveType type);
}