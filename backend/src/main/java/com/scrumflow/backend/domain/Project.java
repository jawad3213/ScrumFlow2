package com.scrumflow.backend.domain;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;

import org.hibernate.annotations.ColumnTransformer;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

/** A project with its financial analysis and, as JSON text, the AI stack analysis. */
@Entity
@Table(name = "projects")
public class Project extends TimestampedEntity {

    @Column(nullable = false)
    public String name;

    /** Owner ("chef"). */
    @Column(name = "user_id")
    public Long userId;

    @Column(name = "start_date")
    public LocalDate startDate;

    @Column(name = "planned_end_date")
    public LocalDate plannedEndDate;

    @Column(name = "actual_end_date")
    public LocalDate actualEndDate;

    public String description;

    @Column(name = "estimated_duration_months", precision = 8, scale = 2)
    public BigDecimal estimatedDurationMonths;

    @Column(name = "total_capex", nullable = false, precision = 15, scale = 2)
    public BigDecimal totalCapex = new BigDecimal("0.00");

    @Column(name = "total_opex", nullable = false, precision = 15, scale = 2)
    public BigDecimal totalOpex = new BigDecimal("0.00");

    @Column(name = "total_project_cost", precision = 15, scale = 2)
    public BigDecimal totalProjectCost;

    @Column(name = "total_gain_value", precision = 15, scale = 2)
    public BigDecimal totalGainValue;

    @Column(name = "annual_opex_value", nullable = false, precision = 15, scale = 2)
    public BigDecimal annualOpexValue = new BigDecimal("0.00");

    @Column(name = "roi_percentage", precision = 8, scale = 2)
    public BigDecimal roiPercentage;

    @Column(name = "break_even_point_months", precision = 8, scale = 2)
    public BigDecimal breakEvenPointMonths;

    @Column(name = "roi_analysis_summary")
    public String roiAnalysisSummary;

    /** JSON text (column type json). */
    @Column(name = "stack_analysis_data")
    @ColumnTransformer(write = "?::json")
    public String stackAnalysisData;

    /** JSON text (column type json). */
    @Column(name = "architecture_plan")
    @ColumnTransformer(write = "?::json")
    public String architecturePlan;

    /** JSON text (column type json). */
    @Column(name = "recommended_stack")
    @ColumnTransformer(write = "?::json")
    public String recommendedStack;

    @Column(name = "stack_name")
    public String stackName;

    /**
     * Port of the Eloquent "saving" hook: planned_end_date = start_date + round(estimated months).
     * Months are added with Carbon's overflow semantics (31 January + 1 month = 3 March), and the
     * rounding is PHP round(), i.e. half away from zero.
     */
    public void computePlannedEndDate() {
        if (startDate == null || estimatedDurationMonths == null || estimatedDurationMonths.signum() <= 0) {
            return;
        }
        int months = estimatedDurationMonths.setScale(0, RoundingMode.HALF_UP).intValue();
        plannedEndDate = startDate.withDayOfMonth(1).plusMonths(months).plusDays(startDate.getDayOfMonth() - 1L);
    }
}
