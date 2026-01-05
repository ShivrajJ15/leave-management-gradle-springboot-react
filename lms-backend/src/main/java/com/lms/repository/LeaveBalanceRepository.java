package com.lms.repository;

import com.lms.model.LeaveBalance;
import com.lms.model.User;
import com.lms.enums.LeaveType;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface LeaveBalanceRepository extends JpaRepository<LeaveBalance, Long> {
    Optional<LeaveBalance> findByUserAndType(User user, LeaveType type);
}