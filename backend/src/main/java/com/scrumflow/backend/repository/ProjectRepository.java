package com.scrumflow.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import com.scrumflow.backend.domain.Project;

public interface ProjectRepository extends JpaRepository<Project, Long> {

    /** Eloquent latest(): newest first. The id tie-break keeps the order stable within one second. */
    List<Project> findByUserIdOrderByCreatedAtDescIdDesc(Long userId);

    boolean existsByUserId(Long userId);

    @Modifying
    @Query("delete from Project p where p.id = :id")
    int deleteProject(Long id);
}
