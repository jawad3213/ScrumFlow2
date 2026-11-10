package com.scrumflow.backend.repository;

import java.util.Collection;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.scrumflow.backend.domain.InfrastructureCost;

public interface InfrastructureCostRepository extends JpaRepository<InfrastructureCost, Long> {

    List<InfrastructureCost> findByProjectIdInOrderById(Collection<Long> ids);
}
