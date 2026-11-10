package com.scrumflow.backend.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "project_epics")
public class ProjectEpic extends TimestampedEntity {

    @Column(name = "project_id", nullable = false)
    public Long projectId;

    @Column(nullable = false)
    public String title;

    public String description;

    /** Identifier from the AI backlog, e.g. "EPIC-1". */
    @Column(name = "external_id")
    public String externalId;
}
