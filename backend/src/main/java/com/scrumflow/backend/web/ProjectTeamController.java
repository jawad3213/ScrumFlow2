package com.scrumflow.backend.web;

import java.util.Map;
import java.util.Objects;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.scrumflow.backend.domain.AssignedEngineer;
import com.scrumflow.backend.domain.Employee;
import com.scrumflow.backend.domain.Project;
import com.scrumflow.backend.domain.TimestampedEntity;
import com.scrumflow.backend.repository.AssignedEngineerRepository;
import com.scrumflow.backend.repository.EmployeeRepository;
import com.scrumflow.backend.repository.ProjectRepository;
import com.scrumflow.backend.security.AuthUser;
import com.scrumflow.backend.service.Views;
import com.scrumflow.backend.support.ApiException;
import com.scrumflow.backend.support.Input;
import com.scrumflow.backend.support.Json;
import com.scrumflow.backend.support.Validation;
import com.scrumflow.backend.support.Values;

/** Staffing a project: filling its role requirements with employees. */
@RestController
@RequestMapping("/api/projects/{projectId}/team")
public class ProjectTeamController {

    private final ProjectRepository projects;
    private final AssignedEngineerRepository engineers;
    private final EmployeeRepository employees;
    private final Validation validation;
    private final Views views;

    public ProjectTeamController(ProjectRepository projects, AssignedEngineerRepository engineers,
                                 EmployeeRepository employees, Validation validation, Views views) {
        this.projects = projects;
        this.engineers = engineers;
        this.employees = employees;
        this.validation = validation;
        this.views = views;
    }

    @GetMapping
    public Map<String, Object> index(@AuthenticationPrincipal AuthUser me, @PathVariable Long projectId) {
        Project project = owned(me, projectId);
        return Json.obj(
                "project", project.name,
                "team", views.assignedEngineers(engineers.findByProjectIdInOrderById(java.util.List.of(project.id)), true));
    }

    /** Puts an employee on a role requirement, releasing whoever held it before. */
    @PostMapping("/assign")
    @Transactional
    public Map<String, Object> assign(@AuthenticationPrincipal AuthUser me, @PathVariable Long projectId, Input in) {
        owned(me, projectId);
        validation.make(in)
                .rule("assigned_engineer_id", "required|exists:assigned_engineers,id")
                .rule("user_id", "required|exists:employees,id")
                .validate();

        AssignedEngineer assignment = assignment(projectId, in);
        Long employeeId = Values.dec(in.get("user_id"), 0).longValueExact();
        Employee employee = employees.findByIdAndUserId(employeeId, me.userId())
                .orElseThrow(() -> ApiException.notFound("Employee", employeeId));

        if (assignment.employeeId != null) {
            employees.setEngaged(assignment.employeeId, false, TimestampedEntity.now());
            employee = employees.findById(employeeId).orElseThrow();
        }
        assignment.employeeId = employee.id;
        assignment = engineers.saveAndFlush(assignment);
        employee.isEngaged = true;
        employees.saveAndFlush(employee);

        return Json.obj("message", "Employee assigned successfully", "assignment", views.assignedEngineer(assignment));
    }

    @PostMapping("/unassign")
    @Transactional
    public Map<String, Object> unassign(@AuthenticationPrincipal AuthUser me, @PathVariable Long projectId, Input in) {
        owned(me, projectId);
        validation.make(in).rule("assigned_engineer_id", "required|exists:assigned_engineers,id").validate();

        AssignedEngineer assignment = assignment(projectId, in);
        if (assignment.employeeId != null) {
            employees.setEngaged(assignment.employeeId, false, TimestampedEntity.now());
            assignment = engineers.findById(assignment.id).orElseThrow();
            assignment.employeeId = null;
            engineers.saveAndFlush(assignment);
        }
        return Json.obj("message", "Employee unassigned successfully");
    }

    /** Same rule as ProjectController: only the project's chef may see or staff it. */
    private Project owned(AuthUser me, Long projectId) {
        Project project = projects.findById(projectId).orElseThrow(() -> ApiException.notFound("Project", projectId));
        if (!Objects.equals(project.userId, me.userId())) {
            throw ApiException.of(HttpStatus.FORBIDDEN, "Unauthorized access to this project");
        }
        return project;
    }

    private AssignedEngineer assignment(Long projectId, Input in) {
        Long id = Values.dec(in.get("assigned_engineer_id"), 0).longValueExact();
        return engineers.findByIdAndProjectId(id, projectId).orElseThrow(() -> ApiException.notFound("AssignedEngineer", null));
    }
}
