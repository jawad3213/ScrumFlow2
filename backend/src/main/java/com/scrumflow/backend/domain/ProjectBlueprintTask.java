package com.scrumflow.backend.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "project_blueprint_tasks")
public class ProjectBlueprintTask extends TimestampedEntity {

    @Column(name = "project_story_id", nullable = false)
    public Long projectStoryId;

    /** Free-text role such as "Backend Developer". */
    @Column(nullable = false)
    public String role;

    public String level;

    @Column(nullable = false)
    public String title;

    public String instructions;

    @Column(nullable = false)
    public Integer hours = 0;

    /** Identifier from the AI backlog, e.g. "T-1.1.1". */
    @Column(name = "external_id")
    public String externalId;
}
