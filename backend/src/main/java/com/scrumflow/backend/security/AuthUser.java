package com.scrumflow.backend.security;

import java.time.Instant;

/**
 * The authenticated principal: the user and the access token (JWT id and expiry) used for this
 * request. Controllers receive it with {@code @AuthenticationPrincipal}.
 */
public record AuthUser(Long userId, String tokenId, Instant expiresAt) {
}
