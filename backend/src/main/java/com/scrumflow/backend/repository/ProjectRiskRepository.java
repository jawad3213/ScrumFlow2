package com.scrumflow.backend.repository;

import java.util.Collection;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.scrumflow.backend.domain.ProjectRisk;

public interface ProjectRiskRepository extends JpaRepository<ProjectRisk, Long> {

    List<ProjectRisk> findByProjectIdInOrderById(Collection<Long> ids);
}
