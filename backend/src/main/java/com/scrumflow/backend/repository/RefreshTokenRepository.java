package com.scrumflow.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import com.scrumflow.backend.domain.RefreshToken;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {

    Optional<RefreshToken> findFirstByToken(String token);

    @Modifying
    @Query("delete from RefreshToken t where t.token = :token")
    int deleteByTokenHash(String token);

    @Modifying
    @Query("delete from RefreshToken t where t.userId = :userId")
    int deleteAllForUser(Long userId);
}
