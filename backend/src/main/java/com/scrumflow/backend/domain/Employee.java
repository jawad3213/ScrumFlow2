package com.scrumflow.backend.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

/** A team member owned by a chef user. */
@Entity
@Table(name = "employees")
public class Employee extends TimestampedEntity {

    /** Owner (the chef). */
    @Column(name = "user_id", nullable = false)
    public Long userId;

    @Column(name = "first_name", nullable = false)
    public String firstName;

    @Column(name = "last_name", nullable = false)
    public String lastName;

    @Column(nullable = false)
    public String email;

    @Column(name = "specialization_id")
    public Long specializationId;

    @Column(name = "is_engaged", nullable = false)
    public boolean isEngaged = false;
}
