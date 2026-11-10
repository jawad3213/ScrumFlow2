package com.scrumflow.backend.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "project_risks")
public class ProjectRisk extends TimestampedEntity {

    @Column(name = "project_id", nullable = false)
    public Long projectId;

    @Column(name = "risk_name", nullable = false)
    public String riskName;

    @Column(nullable = false)
    public String impact;

    @Column(nullable = false)
    public String probability;

    @Column(name = "mitigation_strategy", nullable = false)
    public String mitigationStrategy;
}
