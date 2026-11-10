package com.scrumflow.backend.web;

import java.util.List;
import java.util.Map;
import java.util.Objects;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.scrumflow.backend.domain.Project;
import com.scrumflow.backend.repository.ProjectRepository;
import com.scrumflow.backend.security.AuthUser;
import com.scrumflow.backend.service.ProjectService;
import com.scrumflow.backend.service.Views;
import com.scrumflow.backend.service.Views.Rel;
import com.scrumflow.backend.support.ApiException;
import com.scrumflow.backend.support.Input;
import com.scrumflow.backend.support.Json;
import com.scrumflow.backend.support.Validation;
import com.scrumflow.backend.support.Validator;
import com.scrumflow.backend.support.Values;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    private static final Logger log = LoggerFactory.getLogger(ProjectController.class);

    private final ProjectRepository projects;
    private final ProjectService service;
    private final Validation validation;
    private final Views views;

    public ProjectController(ProjectRepository projects, ProjectService service, Validation validation, Views views) {
        this.projects = projects;
        this.service = service;
        this.validation = validation;
        this.views = views;
    }

    @GetMapping
    public List<Map<String, Object>> index(@AuthenticationPrincipal AuthUser me) {
        return views.projects(projects.findByUserIdOrderByCreatedAtDescIdDesc(me.userId()),
                Rel.CHEF, Rel.ASSIGNED_ENGINEERS, Rel.KPIS, Rel.RISKS);
    }

    @GetMapping("/dashboard")
    public Map<String, Object> dashboard(@AuthenticationPrincipal AuthUser me) {
        return service.dashboard(me.userId());
    }

    /** Saves a project together with the full AI analysis blueprint produced by the wizard. */
    @PostMapping
    public ResponseEntity<Map<String, Object>> store(@AuthenticationPrincipal AuthUser me, Input in) {
        // The AI service sends "project_name"; the wizard sends "name".
        if (!in.has("name") || !Values.truthy(in.str("name"))) {
            if (in.has("project_name")) {
                in.merge("name", in.get("project_name"));
            }
        }
        Validator v = validation.make(in)
                .rule("name", "required|string|max:255")
                .rule("description", "nullable|string");
        if (v.fails()) {
            throw new ApiException(HttpStatus.UNPROCESSABLE_CONTENT, Json.obj(
                    "message", "Validation failed: " + String.join(", ", v.allMessages()),
                    "errors", v.errors()));
        }

        Project project;
        try {
            project = service.createFromBlueprint(in, me.userId());
        } catch (IllegalArgumentException e) {
            // Our own messages about the blueprint content, written for the user
            throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR, Json.obj(
                    "message", "Failed to save project blueprint.", "error", e.getMessage()));
        } catch (RuntimeException e) {
            // Anything else (database, mapping...) is logged, not sent: it can reveal internals
            log.error("Failed to save project blueprint", e);
            throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR, Json.obj(
                    "message", "Failed to save project blueprint."));
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(Json.obj(
                "message", "Project and AI analysis blueprint saved successfully.",
                "project", views.project(project, Views.FULL)));
    }

    @GetMapping("/{id}")
    public Map<String, Object> show(@AuthenticationPrincipal AuthUser me, @PathVariable Long id) {
        return views.project(owned(me, id), Views.FULL);
    }

    @PutMapping("/{id}")
    public Map<String, Object> update(@AuthenticationPrincipal AuthUser me, @PathVariable Long id, Input in) {
        Project project = owned(me, id);
        validation.make(in)
                .rule("name", "sometimes|required|string|max:255")
                .rule("description", "nullable|string")
                .rule("start_date", "nullable|date")
                .rule("planned_end_date", "nullable|date|after_or_equal:start_date")
                .rule("actual_end_date", "nullable|date|after_or_equal:start_date")
                .validateErrorsOnly();

        service.update(project, in);
        return Json.obj("message", "Project updated successfully",
                "project", views.project(project, Rel.CHEF, Rel.EPICS_STORIES_TASKS));
    }

    /** Saves the stack analysis chosen for the project. */
    @PostMapping("/{id}/stack")
    public Map<String, Object> saveStack(@AuthenticationPrincipal AuthUser me, @PathVariable Long id, Input in) {
        Project project = owned(me, id);
        validation.make(in)
                .rule("stack_analysis_data", "nullable|array")
                .rule("stack_name", "nullable|string|max:255")
                .validateErrorsOnly();

        service.saveStack(project, in);
        return Json.obj("message", "Stack strategy saved successfully.", "project", views.project(project));
    }

    @DeleteMapping("/{id}")
    public Map<String, Object> destroy(@AuthenticationPrincipal AuthUser me, @PathVariable Long id) {
        service.delete(owned(me, id));
        return Json.obj("message", "Project deleted successfully");
    }

    private Project owned(AuthUser me, Long id) {
        Project project = projects.findById(id)
                .orElseThrow(() -> ApiException.of(HttpStatus.NOT_FOUND, "Project not found"));
        if (!Objects.equals(project.userId, me.userId())) {
            throw ApiException.of(HttpStatus.FORBIDDEN, "Unauthorized access to this project");
        }
        return project;
    }
}
