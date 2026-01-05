package com.lms.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.lms.enums.Role;
import jakarta.persistence.*;
import lombok.Data;

import java.util.List;


@Data
@Entity
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    @Column(unique = true)
    private String email;
    private String password;
    @Enumerated(EnumType.STRING)
    private Role role; // EMPLOYEE, MANAGER, ADMIN

    @ManyToOne
    @JoinColumn(name = "manager_id")
    private User manager;

    @JsonIgnore
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<Leave> leaves;

    @JsonIgnore
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<LeaveBalance> leaveBalances;
}
