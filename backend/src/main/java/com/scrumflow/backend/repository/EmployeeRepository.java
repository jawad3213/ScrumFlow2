package com.scrumflow.backend.repository;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import com.scrumflow.backend.domain.Employee;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {

    List<Employee> findByUserIdOrderById(Long userId);

    List<Employee> findByUserIdAndIsEngagedOrderById(Long userId, boolean isEngaged);

    Optional<Employee> findByIdAndUserId(Long id, Long userId);

    List<Employee> findByIdIn(Collection<Long> ids);

    long countByUserIdAndSpecializationId(Long userId, Long specializationId);

    @Modifying
    @Query("delete from Employee e where e.userId = :userId and e.id in :ids")
    int deleteOwned(Long userId, Collection<Long> ids);

    /** Same as Employee::where('id', $id)->update(['is_engaged' => ...]), which also bumps updated_at. */
    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("update Employee e set e.isEngaged = :engaged, e.updatedAt = :now where e.id = :id")
    int setEngaged(Long id, boolean engaged, LocalDateTime now);
}
