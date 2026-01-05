package com.lms.service;

import com.lms.dto.PolicyDTO;
import com.lms.model.LeavePolicy;
import com.lms.repository.LeavePolicyRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PolicyService {

    private final LeavePolicyRepository policyRepository;

    public PolicyService(LeavePolicyRepository policyRepository) {
        this.policyRepository = policyRepository;
    }

    public void createOrUpdatePolicy(PolicyDTO policyDTO) {
        LeavePolicy policy = policyRepository.findById(policyDTO.type())
                .orElse(new LeavePolicy());

        policy.setType(policyDTO.type());
        policy.setMaxDays(policyDTO.maxDays());
        policy.setCarryOver(policyDTO.carryOver());

        if (policyDTO.carryOver()) {
            policy.setMaxCarryOverDays(
                    Optional.ofNullable(policyDTO.maxCarryOverDays())
                            .orElse(0)
            );
        } else {
            policy.setMaxCarryOverDays(0);
        }

        policyRepository.save(policy);
    }

    public List<PolicyDTO> getAllPolicies() {
        return policyRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private PolicyDTO convertToDTO(LeavePolicy policy) {
        return new PolicyDTO(
                policy.getType(),
                policy.getMaxDays(),
                policy.isCarryOver(),
                policy.getMaxCarryOverDays()
        );
    }
}