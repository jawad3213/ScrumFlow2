package com.scrumflow.backend.repository;

import java.util.Collection;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.scrumflow.backend.domain.ProjectStory;

public interface ProjectStoryRepository extends JpaRepository<ProjectStory, Long> {

    List<ProjectStory> findByProjectEpicIdInOrderById(Collection<Long> ids);
}
