package com.scrumflow.backend.repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.scrumflow.backend.domain.AssignedEngineer;

public interface AssignedEngineerRepository extends JpaRepository<AssignedEngineer, Long> {

    List<AssignedEngineer> findByProjectIdInOrderById(Collection<Long> projectIds);

    Optional<AssignedEngineer> findByIdAndProjectId(Long id, Long projectId);

    @Query("select count(distinct a.employeeId) from AssignedEngineer a where a.projectId in :projectIds and a.employeeId is not null")
    long countDistinctEmployees(Collection<Long> projectIds);
}
