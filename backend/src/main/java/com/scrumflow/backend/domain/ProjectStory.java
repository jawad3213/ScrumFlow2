package com.scrumflow.backend.domain;

import org.hibernate.annotations.ColumnTransformer;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "project_stories")
public class ProjectStory extends TimestampedEntity {

    @Column(name = "project_epic_id", nullable = false)
    public Long projectEpicId;

    @Column(nullable = false)
    public String title;

    public String description;

    @Column(name = "story_points", nullable = false)
    public Integer storyPoints = 0;

    /** JSON text (column type json), usually an array of strings. */
    @Column(name = "acceptance_criteria")
    @ColumnTransformer(write = "?::json")
    public String acceptanceCriteria;

    /** Identifier from the AI backlog, e.g. "US-1.1". */
    @Column(name = "external_id")
    public String externalId;
}
