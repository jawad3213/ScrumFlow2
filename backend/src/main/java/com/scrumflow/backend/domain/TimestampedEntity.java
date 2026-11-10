package com.scrumflow.backend.domain;

import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.time.temporal.ChronoUnit;

import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.MappedSuperclass;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;

/**
 * Bigint identity key plus Eloquent-style created_at / updated_at columns (timestamp(0), UTC).
 * updated_at only changes when the row is actually dirty, as with Eloquent.
 *
 * <p>Entities expose public fields and hold plain foreign-key ids instead of JPA associations.
 * Related rows are loaded explicitly in batches (see {@code service.Views}), the same way Laravel's
 * {@code with()} eager loading worked, which keeps queries predictable and avoids lazy-loading traps.</p>
 */
@MappedSuperclass
public abstract class TimestampedEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    @Column(name = "created_at", updatable = false)
    public LocalDateTime createdAt;

    @Column(name = "updated_at")
    public LocalDateTime updatedAt;

    public static LocalDateTime now() {
        return LocalDateTime.now(ZoneOffset.UTC).truncatedTo(ChronoUnit.SECONDS);
    }

    @PrePersist
    void onCreate() {
        LocalDateTime now = now();
        if (createdAt == null) {
            createdAt = now;
        }
        updatedAt = now;
    }

    @PreUpdate
    void onUpdate() {
        updatedAt = now();
    }
}
