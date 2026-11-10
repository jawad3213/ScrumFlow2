package com.scrumflow.backend.repository;

import java.util.Collection;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.scrumflow.backend.domain.EstimatedGain;

public interface EstimatedGainRepository extends JpaRepository<EstimatedGain, Long> {

    List<EstimatedGain> findByProjectIdInOrderById(Collection<Long> ids);
}
