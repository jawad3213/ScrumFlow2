package com.scrumflow.backend.repository;

import java.util.Collection;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import com.scrumflow.backend.domain.ProjectEpic;

public interface ProjectEpicRepository extends JpaRepository<ProjectEpic, Long> {

    List<ProjectEpic> findByProjectIdInOrderById(Collection<Long> ids);

    /** Stories and tasks go with their epic through ON DELETE CASCADE. */
    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("delete from ProjectEpic e where e.projectId = :projectId")
    int deleteByProject(Long projectId);
}
