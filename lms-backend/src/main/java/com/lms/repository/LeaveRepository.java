package com.lms.repository;

import com.lms.enums.LeaveStatus;
import com.lms.model.Leave;
import com.lms.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface LeaveRepository extends JpaRepository<Leave, Long> {
    List<Leave> findByUserAndStatusNot(User user, LeaveStatus status);

    List<Leave> findByUser(User user);
}