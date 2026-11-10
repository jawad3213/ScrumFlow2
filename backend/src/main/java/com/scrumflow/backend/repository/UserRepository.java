package com.scrumflow.backend.repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.scrumflow.backend.domain.User;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findFirstByEmail(String email);

    Optional<User> findFirstByGoogleId(String googleId);

    Optional<User> findFirstByGoogleIdOrEmail(String googleId, String email);

    List<User> findByRoleOrderById(String role);

    List<User> findByIdIn(Collection<Long> ids);
}
