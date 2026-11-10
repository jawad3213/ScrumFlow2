package com.scrumflow.backend.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "project_kpis")
public class ProjectKpi extends TimestampedEntity {

    @Column(name = "project_id", nullable = false)
    public Long projectId;

    @Column(name = "metric_name", nullable = false)
    public String metricName;

    @Column(name = "target_value", nullable = false)
    public String targetValue;

    @Column(name = "measurement_method", nullable = false)
    public String measurementMethod;
}
