package com.scrumflow.backend.domain;

import java.math.BigDecimal;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "estimated_gains")
public class EstimatedGain extends TimestampedEntity {

    @Column(name = "project_id", nullable = false)
    public Long projectId;

    @Column(name = "item_name", nullable = false)
    public String itemName;

    @Column(name = "cost_mad", nullable = false, precision = 15, scale = 2)
    public BigDecimal costMad;

    public String formule;

    public String description;
}
