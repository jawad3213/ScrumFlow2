package com.scrumflow.backend.domain;

import java.math.BigDecimal;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "infrastructure_costs")
public class InfrastructureCost extends TimestampedEntity {

    @Column(name = "project_id", nullable = false)
    public Long projectId;

    /** "capex" (licences and APIs) or "opex" (cloud subscriptions). */
    @Column(nullable = false)
    public String type;

    @Column(name = "item_name", nullable = false)
    public String itemName;

    @Column(name = "cost_mad", nullable = false, precision = 15, scale = 2)
    public BigDecimal costMad;

    public String formule;

    public String description;
}
