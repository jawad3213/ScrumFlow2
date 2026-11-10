package com.scrumflow.backend.repository;

import java.util.Collection;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.scrumflow.backend.domain.ProjectKpi;

public interface ProjectKpiRepository extends JpaRepository<ProjectKpi, Long> {

    List<ProjectKpi> findByProjectIdInOrderById(Collection<Long> ids);
}
