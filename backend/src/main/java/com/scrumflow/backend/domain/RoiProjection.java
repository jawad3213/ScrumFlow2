package com.scrumflow.backend.domain;

import java.math.BigDecimal;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "roi_projections")
public class RoiProjection extends TimestampedEntity {

    @Column(name = "project_id", nullable = false)
    public Long projectId;

    @Column(name = "year_number", nullable = false)
    public Integer yearNumber;

    @Column(name = "cumulative_costs", nullable = false, precision = 15, scale = 2)
    public BigDecimal cumulativeCosts;

    @Column(name = "cumulative_gains", nullable = false, precision = 15, scale = 2)
    public BigDecimal cumulativeGains;

    @Column(name = "net_cash_flow", nullable = false, precision = 15, scale = 2)
    public BigDecimal netCashFlow;

    @Column(name = "roi_percentage", nullable = false, precision = 10, scale = 2)
    public BigDecimal roiPercentage;
}
