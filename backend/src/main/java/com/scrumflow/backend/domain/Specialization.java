package com.scrumflow.backend.domain;

import java.math.BigDecimal;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

/** A role and seniority level with its monthly salary in MAD, shared by all users. */
@Entity
@Table(name = "specializations")
public class Specialization extends TimestampedEntity {

    @Column(nullable = false)
    public String name;

    @Column(nullable = false)
    public String level;

    /** Monthly salary, decimal(10, 2). */
    @Column(nullable = false, precision = 10, scale = 2)
    public BigDecimal salary;
}
