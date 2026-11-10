package com.scrumflow.backend.domain;

import java.math.BigDecimal;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

/** A staffing requirement of a project (role and duration), optionally filled by an employee. */
@Entity
@Table(name = "assigned_engineers")
public class AssignedEngineer extends TimestampedEntity {

    @Column(name = "project_id", nullable = false)
    public Long projectId;

    @Column(name = "specialization_id", nullable = false)
    public Long specializationId;

    @Column(name = "employee_id")
    public Long employeeId;

    /** "development" or "maintenance". */
    @Column(nullable = false)
    public String phase;

    @Column(name = "months_assigned", nullable = false, precision = 8, scale = 2)
    public BigDecimal monthsAssigned;
}
