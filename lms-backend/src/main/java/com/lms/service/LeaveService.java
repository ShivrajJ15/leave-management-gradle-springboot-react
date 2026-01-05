package com.lms.service;

import com.lms.dto.LeaveRequestDTO;
import com.lms.exception.CustomException;
import com.lms.model.Leave;
import com.lms.model.LeaveBalance;
import com.lms.model.LeavePolicy;
import com.lms.model.User;
import com.lms.enums.LeaveStatus;
import com.lms.repository.LeaveBalanceRepository;
import com.lms.repository.LeavePolicyRepository;
import com.lms.repository.LeaveRepository;
import com.lms.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;

@Service
public class LeaveService {

    private final LeaveRepository leaveRepository;
    private final UserRepository userRepository;
    private final LeavePolicyRepository policyRepository;
    private final LeaveBalanceRepository balanceRepository;

    public LeaveService(LeaveRepository leaveRepository,
                        UserRepository userRepository,
                        LeavePolicyRepository policyRepository,
                        LeaveBalanceRepository balanceRepository) {
        this.leaveRepository = leaveRepository;
        this.userRepository = userRepository;
        this.policyRepository = policyRepository;
        this.balanceRepository = balanceRepository;
    }

    @Transactional
    public void applyLeave(LeaveRequestDTO request, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new CustomException("User not found", HttpStatus.NOT_FOUND));

        LeavePolicy policy = policyRepository.findById(request.type())
                .orElseThrow(() -> new CustomException("Leave policy not found", HttpStatus.BAD_REQUEST));

        long requestedDays = ChronoUnit.DAYS.between(request.startDate(), request.endDate()) + 1;

        if (requestedDays > policy.getMaxDays()) {
            throw new CustomException("Exceeds max allowed days for this leave type", HttpStatus.BAD_REQUEST);
        }

        if (request.startDate().isBefore(LocalDate.now())) {
            throw new CustomException("Cannot apply for past dates", HttpStatus.BAD_REQUEST);
        }

        LeaveBalance balance = balanceRepository.findByUserAndType(user, request.type())
                .orElseThrow(() -> new CustomException("Leave balance not found", HttpStatus.BAD_REQUEST));

        if (balance.getBalance() < requestedDays) {
            throw new CustomException("Insufficient leave balance", HttpStatus.BAD_REQUEST);
        }

        // Check for overlapping leaves
        List<Leave> existingLeaves = leaveRepository.findByUserAndStatusNot(user, LeaveStatus.REJECTED);
        boolean hasOverlap = existingLeaves.stream().anyMatch(leave ->
                !(request.endDate().isBefore(leave.getStartDate()) || request.startDate().isAfter(leave.getEndDate()))
        );

        if (hasOverlap) {
            throw new CustomException("Leave dates overlap with existing approved/pending leave", HttpStatus.BAD_REQUEST);
        }

        Leave leave = new Leave();
        leave.setUser(user);
        leave.setStartDate(request.startDate());
        leave.setEndDate(request.endDate());
        leave.setType(request.type());
        leave.setReason(request.reason());
        leave.setStatus(LeaveStatus.PENDING);

        leaveRepository.save(leave);
    }

    public List<Leave> getLeavesByUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new CustomException("User not found", HttpStatus.NOT_FOUND));
        return leaveRepository.findByUser(user);
    }

    @Transactional
    public void withdrawLeave(Long id, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new CustomException("User not found", HttpStatus.NOT_FOUND));

        Leave leave = leaveRepository.findById(id)
                .orElseThrow(() -> new CustomException("Leave request not found", HttpStatus.NOT_FOUND));

        if (!leave.getUser().getId().equals(user.getId())) {
            throw new CustomException("Unauthorized to withdraw this leave", HttpStatus.FORBIDDEN);
        }

        if (leave.getStatus() != LeaveStatus.PENDING) {
            throw new CustomException("Only pending leaves can be withdrawn", HttpStatus.BAD_REQUEST);
        }

        leave.setStatus(LeaveStatus.WITHDRAWN);
        leaveRepository.save(leave);
    }

    @Transactional
    public void updateLeaveStatus(Long id, LeaveStatus status, String approverEmail) {
        Leave leave = leaveRepository.findById(id)
                .orElseThrow(() -> new CustomException("Leave request not found", HttpStatus.NOT_FOUND));

        User approver = userRepository.findByEmail(approverEmail)
                .orElseThrow(() -> new CustomException("Approver not found", HttpStatus.NOT_FOUND));

        // Verify approver is manager of the employee
        if (!leave.getUser().getManager().getId().equals(approver.getId())) {
            throw new CustomException("Unauthorized to approve this leave", HttpStatus.FORBIDDEN);
        }

        if (leave.getStatus() != LeaveStatus.PENDING) {
            throw new CustomException("Leave is not in pending state", HttpStatus.BAD_REQUEST);
        }

        leave.setStatus(status);
        leaveRepository.save(leave);

        // Deduct leave balance if approved
        if (status == LeaveStatus.APPROVED) {
            long approvedDays = ChronoUnit.DAYS.between(leave.getStartDate(), leave.getEndDate()) + 1;
            LeaveBalance balance = balanceRepository.findByUserAndType(leave.getUser(), leave.getType())
                    .orElseThrow(() -> new CustomException("Leave balance not found", HttpStatus.INTERNAL_SERVER_ERROR));

            balance.setBalance(balance.getBalance() - (int) approvedDays);
            balanceRepository.save(balance);
        }
    }
}