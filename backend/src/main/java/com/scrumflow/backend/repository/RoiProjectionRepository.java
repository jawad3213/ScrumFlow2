package com.scrumflow.backend.repository;

import java.util.Collection;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.scrumflow.backend.domain.RoiProjection;

public interface RoiProjectionRepository extends JpaRepository<RoiProjection, Long> {

    List<RoiProjection> findByProjectIdInOrderById(Collection<Long> ids);
}
