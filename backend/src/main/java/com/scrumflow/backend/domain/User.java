package com.scrumflow.backend.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

/** A platform account ("chef"). Team members are {@link Employee}s, not users. */
@Entity
@Table(name = "users")
public class User extends TimestampedEntity {

    @Column(name = "first_name", nullable = false)
    public String firstName;

    @Column(name = "last_name", nullable = false)
    public String lastName;

    @Column(nullable = false)
    public String email;

    @Column(name = "google_id")
    public String googleId;

    public String avatar;

    /** bcrypt hash, or null for accounts created through Google sign-in. */
    public String password;

    @Column(nullable = false)
    public String role = "employee";

    @Column(name = "specialization_id")
    public Long specializationId;

    @Column(name = "is_engaged", nullable = false)
    public boolean isEngaged = false;

    /** May edit the shared specializations catalogue. */
    @Column(name = "is_admin", nullable = false)
    public boolean isAdmin = false;

    @Column(name = "remember_token")
    public String rememberToken;
}
