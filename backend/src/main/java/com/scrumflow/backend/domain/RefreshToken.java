package com.scrumflow.backend.domain;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

/** Long-lived refresh token sent as an HttpOnly cookie; only its sha256 hash is stored. */
@Entity
@Table(name = "refresh_tokens")
public class RefreshToken extends TimestampedEntity {

    @Column(name = "user_id", nullable = false)
    public Long userId;

    /** sha256 hex of the raw cookie value. */
    @Column(nullable = false, length = 64)
    public String token;

    @Column(name = "expires_at")
    public LocalDateTime expiresAt;

    public boolean isExpired() {
        return expiresAt != null && expiresAt.isBefore(now());
    }
}
