package com.scrumflow.backend.repository;

import java.util.Collection;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.scrumflow.backend.domain.ProjectBlueprintTask;

public interface ProjectBlueprintTaskRepository extends JpaRepository<ProjectBlueprintTask, Long> {

    List<ProjectBlueprintTask> findByProjectStoryIdInOrderById(Collection<Long> ids);
}
