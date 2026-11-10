package com.scrumflow.backend.repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import com.scrumflow.backend.domain.Specialization;

public interface SpecializationRepository extends JpaRepository<Specialization, Long> {

    List<Specialization> findAllByOrderById();

    List<Specialization> findByIdIn(Collection<Long> ids);

    Optional<Specialization> findFirstByNameAndLevelOrderById(String name, String level);

    @Modifying
    @Query("delete from Specialization s where s.id in :ids")
    int deleteByIds(Collection<Long> ids);
}
