package com.scrumflow.backend.service;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.scrumflow.backend.domain.AssignedEngineer;
import com.scrumflow.backend.domain.Employee;
import com.scrumflow.backend.domain.EstimatedGain;
import com.scrumflow.backend.domain.InfrastructureCost;
import com.scrumflow.backend.domain.Project;
import com.scrumflow.backend.domain.ProjectBlueprintTask;
import com.scrumflow.backend.domain.ProjectEpic;
import com.scrumflow.backend.domain.ProjectKpi;
import com.scrumflow.backend.domain.ProjectRisk;
import com.scrumflow.backend.domain.ProjectStory;
import com.scrumflow.backend.domain.RoiProjection;
import com.scrumflow.backend.domain.Specialization;
import com.scrumflow.backend.domain.TimestampedEntity;
import com.scrumflow.backend.domain.User;
import com.scrumflow.backend.repository.AssignedEngineerRepository;
import com.scrumflow.backend.repository.EmployeeRepository;
import com.scrumflow.backend.repository.EstimatedGainRepository;
import com.scrumflow.backend.repository.InfrastructureCostRepository;
import com.scrumflow.backend.repository.ProjectBlueprintTaskRepository;
import com.scrumflow.backend.repository.ProjectEpicRepository;
import com.scrumflow.backend.repository.ProjectKpiRepository;
import com.scrumflow.backend.repository.ProjectRiskRepository;
import com.scrumflow.backend.repository.ProjectStoryRepository;
import com.scrumflow.backend.repository.RoiProjectionRepository;
import com.scrumflow.backend.repository.SpecializationRepository;
import com.scrumflow.backend.repository.UserRepository;
import com.scrumflow.backend.support.Json;

import tools.jackson.databind.json.JsonMapper;

/**
 * Builds API response bodies. Attribute names, order and formats match what Eloquent's toArray()
 * produced, and relations are loaded in batches like Laravel's with(): one query per relation.
 */
@Service
@Transactional(readOnly = true)
public class Views {

    /** Project relations, named as in the old Project::with([...]) calls. */
    public enum Rel { CHEF, ASSIGNED_ENGINEERS, ASSIGNED_ENGINEERS_EMPLOYEE, ESTIMATED_GAINS, INFRASTRUCTURE_COSTS,
        ROI_PROJECTIONS, KPIS, RISKS, EPICS, EPICS_STORIES, EPICS_STORIES_TASKS }

    /** Everything ProjectController::show() loaded. */
    public static final Rel[] FULL = { Rel.CHEF, Rel.ASSIGNED_ENGINEERS, Rel.ESTIMATED_GAINS, Rel.INFRASTRUCTURE_COSTS,
            Rel.ROI_PROJECTIONS, Rel.KPIS, Rel.RISKS, Rel.EPICS_STORIES_TASKS };

    private final JsonMapper jsonMapper;
    private final UserRepository users;
    private final SpecializationRepository specializations;
    private final EmployeeRepository employees;
    private final AssignedEngineerRepository engineers;
    private final EstimatedGainRepository gains;
    private final InfrastructureCostRepository infrastructure;
    private final RoiProjectionRepository roi;
    private final ProjectKpiRepository kpis;
    private final ProjectRiskRepository risks;
    private final ProjectEpicRepository epics;
    private final ProjectStoryRepository stories;
    private final ProjectBlueprintTaskRepository tasks;

    public Views(JsonMapper jsonMapper, UserRepository users, SpecializationRepository specializations,
                 EmployeeRepository employees, AssignedEngineerRepository engineers, EstimatedGainRepository gains,
                 InfrastructureCostRepository infrastructure, RoiProjectionRepository roi, ProjectKpiRepository kpis,
                 ProjectRiskRepository risks, ProjectEpicRepository epics, ProjectStoryRepository stories,
                 ProjectBlueprintTaskRepository tasks) {
        this.jsonMapper = jsonMapper;
        this.users = users;
        this.specializations = specializations;
        this.employees = employees;
        this.engineers = engineers;
        this.gains = gains;
        this.infrastructure = infrastructure;
        this.roi = roi;
        this.kpis = kpis;
        this.risks = risks;
        this.epics = epics;
        this.stories = stories;
        this.tasks = tasks;
    }

    // ------------------------------------------------------------------ users and people

    /** User attributes; password and remember_token are hidden, has_password is appended. */
    public Map<String, Object> user(User u) {
        if (u == null) {
            return null;
        }
        return Json.obj(
                "id", u.id,
                "first_name", u.firstName,
                "last_name", u.lastName,
                "email", u.email,
                "avatar", u.avatar,
                "role", u.role,
                "specialization_id", u.specializationId,
                "is_engaged", u.isEngaged,
                "is_admin", u.isAdmin,
                "created_at", Json.ts(u.createdAt),
                "updated_at", Json.ts(u.updatedAt),
                "google_id", u.googleId,
                "has_password", u.password != null);
    }

    /** $user->load('specialization'). */
    public Map<String, Object> userWithSpecialization(User u) {
        Map<String, Object> out = user(u);
        Specialization s = u.specializationId == null ? null : specializations.findById(u.specializationId).orElse(null);
        out.put("specialization", specialization(s));
        return out;
    }

    public Map<String, Object> specialization(Specialization s) {
        if (s == null) {
            return null;
        }
        return Json.obj(
                "id", s.id,
                "name", s.name,
                "level", s.level,
                "salary", Json.dec(s.salary),
                "created_at", Json.ts(s.createdAt),
                "updated_at", Json.ts(s.updatedAt));
    }

    public List<Map<String, Object>> specializations(List<Specialization> list) {
        return list.stream().map(this::specialization).toList();
    }

    /** Employees with their specialization loaded. */
    public List<Map<String, Object>> employees(List<Employee> list) {
        Map<Long, Specialization> specs = byId(specializations.findByIdIn(ids(list, e -> e.specializationId)));
        return list.stream().map(e -> employee(e, specs.get(e.specializationId))).toList();
    }

    public Map<String, Object> employee(Employee e) {
        return employees(List.of(e)).get(0);
    }

    private Map<String, Object> employee(Employee e, Specialization s) {
        Map<String, Object> out = Json.obj(
                "id", e.id,
                "user_id", e.userId,
                "first_name", e.firstName,
                "last_name", e.lastName,
                "email", e.email,
                "specialization_id", e.specializationId,
                "is_engaged", e.isEngaged,
                "created_at", Json.ts(e.createdAt),
                "updated_at", Json.ts(e.updatedAt));
        out.put("specialization", specialization(s));
        return out;
    }

    // ------------------------------------------------------------------ projects

    /** Project attributes only (no relations). */
    public Map<String, Object> project(Project p) {
        return Json.obj(
                "id", p.id,
                "name", p.name,
                "user_id", p.userId,
                "start_date", Json.date(p.startDate),
                "planned_end_date", Json.date(p.plannedEndDate),
                "actual_end_date", Json.date(p.actualEndDate),
                "description", p.description,
                "estimated_duration_months", Json.dec(p.estimatedDurationMonths),
                "total_capex", Json.dec(p.totalCapex),
                "total_opex", Json.dec(p.totalOpex),
                "total_project_cost", Json.dec(p.totalProjectCost),
                "total_gain_value", Json.dec(p.totalGainValue),
                "annual_opex_value", Json.dec(p.annualOpexValue),
                "roi_percentage", Json.dec(p.roiPercentage),
                "break_even_point_months", Json.dec(p.breakEvenPointMonths),
                "roi_analysis_summary", p.roiAnalysisSummary,
                "stack_analysis_data", parseJson(p.stackAnalysisData),
                "architecture_plan", parseJson(p.architecturePlan),
                "recommended_stack", parseJson(p.recommendedStack),
                "stack_name", p.stackName,
                "created_at", Json.ts(p.createdAt),
                "updated_at", Json.ts(p.updatedAt));
    }

    public Map<String, Object> project(Project p, Rel... relations) {
        return projects(List.of(p), relations).get(0);
    }

    /** Projects with the given relations, loaded with one query per relation for the whole list. */
    public List<Map<String, Object>> projects(List<Project> list, Rel... relations) {
        Set<Rel> with = Set.of(relations);
        List<Long> projectIds = list.stream().map(p -> p.id).toList();
        List<Map<String, Object>> out = list.stream().map(this::project).collect(Collectors.toCollection(ArrayList::new));

        for (Rel rel : relations) {
            switch (rel) {
                case CHEF -> {
                    Map<Long, User> chefs = byId(users.findByIdIn(ids(list, p -> p.userId)));
                    put(out, list, "chef", p -> user(chefs.get(p.userId)));
                }
                case ASSIGNED_ENGINEERS, ASSIGNED_ENGINEERS_EMPLOYEE -> {
                    var grouped = group(engineers.findByProjectIdInOrderById(projectIds), a -> a.projectId);
                    boolean withEmployee = with.contains(Rel.ASSIGNED_ENGINEERS_EMPLOYEE);
                    put(out, list, "assigned_engineers", p -> assignedEngineers(grouped.getOrDefault(p.id, List.of()), withEmployee));
                }
                case ESTIMATED_GAINS -> {
                    var grouped = group(gains.findByProjectIdInOrderById(projectIds), g -> g.projectId);
                    put(out, list, "estimated_gains", p -> grouped.getOrDefault(p.id, List.of()).stream().map(Views::gain).toList());
                }
                case INFRASTRUCTURE_COSTS -> {
                    var grouped = group(infrastructure.findByProjectIdInOrderById(projectIds), c -> c.projectId);
                    put(out, list, "infrastructure_costs", p -> grouped.getOrDefault(p.id, List.of()).stream().map(Views::infrastructureCost).toList());
                }
                case ROI_PROJECTIONS -> {
                    var grouped = group(roi.findByProjectIdInOrderById(projectIds), r -> r.projectId);
                    put(out, list, "roi_projections", p -> grouped.getOrDefault(p.id, List.of()).stream().map(Views::roiProjection).toList());
                }
                case KPIS -> {
                    var grouped = group(kpis.findByProjectIdInOrderById(projectIds), k -> k.projectId);
                    put(out, list, "kpis", p -> grouped.getOrDefault(p.id, List.of()).stream().map(Views::kpi).toList());
                }
                case RISKS -> {
                    var grouped = group(risks.findByProjectIdInOrderById(projectIds), r -> r.projectId);
                    put(out, list, "risks", p -> grouped.getOrDefault(p.id, List.of()).stream().map(Views::risk).toList());
                }
                case EPICS, EPICS_STORIES, EPICS_STORIES_TASKS -> {
                    var grouped = group(epics.findByProjectIdInOrderById(projectIds), e -> e.projectId);
                    int depth = rel == Rel.EPICS ? 0 : rel == Rel.EPICS_STORIES ? 1 : 2;
                    var allEpics = grouped.values().stream().flatMap(Collection::stream).toList();
                    var epicViews = epics(allEpics, depth);
                    put(out, list, "epics", p -> grouped.getOrDefault(p.id, List.of()).stream().map(e -> epicViews.get(e.id)).toList());
                }
            }
        }
        return out;
    }

    /** Assigned engineers; specialization is always present (the total_cost accessor loaded it). */
    public List<Map<String, Object>> assignedEngineers(List<AssignedEngineer> list, boolean withEmployee) {
        Map<Long, Employee> emps = withEmployee ? byId(employees.findByIdIn(ids(list, a -> a.employeeId))) : Map.of();
        List<Long> specIds = new ArrayList<>(ids(list, a -> a.specializationId));
        specIds.addAll(ids(emps.values(), e -> e.specializationId));
        Map<Long, Specialization> specs = byId(specializations.findByIdIn(specIds));

        return list.stream().map(a -> {
            Specialization s = specs.get(a.specializationId);
            Map<String, Object> out = Json.obj(
                    "id", a.id,
                    "project_id", a.projectId,
                    "specialization_id", a.specializationId,
                    "phase", a.phase,
                    "months_assigned", Json.dec(a.monthsAssigned),
                    "created_at", Json.ts(a.createdAt),
                    "updated_at", Json.ts(a.updatedAt),
                    "employee_id", a.employeeId,
                    "total_cost", s == null ? (Object) 0 : s.salary.multiply(a.monthsAssigned).doubleValue(),
                    "specialization", specialization(s));
            if (withEmployee) {
                Employee e = a.employeeId == null ? null : emps.get(a.employeeId);
                out.put("employee", e == null ? null : employee(e, specs.get(e.specializationId)));
            }
            return out;
        }).toList();
    }

    public Map<String, Object> assignedEngineer(AssignedEngineer a) {
        return assignedEngineers(List.of(a), true).get(0);
    }

    /** Epic views keyed by epic id, with stories (depth 1) and their tasks (depth 2). */
    private Map<Long, Map<String, Object>> epics(List<ProjectEpic> list, int depth) {
        Map<Long, List<ProjectStory>> storiesByEpic = depth >= 1
                ? group(stories.findByProjectEpicIdInOrderById(list.stream().map(e -> e.id).toList()), s -> s.projectEpicId)
                : Map.of();
        Map<Long, List<ProjectBlueprintTask>> tasksByStory = depth >= 2
                ? group(tasks.findByProjectStoryIdInOrderById(storiesByEpic.values().stream().flatMap(Collection::stream).map(s -> s.id).toList()), t -> t.projectStoryId)
                : Map.of();

        return list.stream().collect(Collectors.toMap(e -> e.id, e -> {
            Map<String, Object> out = Json.obj(
                    "id", e.id,
                    "project_id", e.projectId,
                    "title", e.title,
                    "description", e.description,
                    "external_id", e.externalId,
                    "created_at", Json.ts(e.createdAt),
                    "updated_at", Json.ts(e.updatedAt));
            if (depth >= 1) {
                out.put("stories", storiesByEpic.getOrDefault(e.id, List.of()).stream().map(s -> {
                    Map<String, Object> story = story(s);
                    if (depth >= 2) {
                        story.put("tasks", tasksByStory.getOrDefault(s.id, List.of()).stream().map(Views::task).toList());
                    }
                    return story;
                }).toList());
            }
            return out;
        }));
    }

    private Map<String, Object> story(ProjectStory s) {
        return Json.obj(
                "id", s.id,
                "project_epic_id", s.projectEpicId,
                "title", s.title,
                "description", s.description,
                "story_points", s.storyPoints,
                "acceptance_criteria", parseJson(s.acceptanceCriteria),
                "external_id", s.externalId,
                "created_at", Json.ts(s.createdAt),
                "updated_at", Json.ts(s.updatedAt));
    }

    private static Map<String, Object> task(ProjectBlueprintTask t) {
        return Json.obj(
                "id", t.id,
                "project_story_id", t.projectStoryId,
                "role", t.role,
                "level", t.level,
                "title", t.title,
                "instructions", t.instructions,
                "hours", t.hours,
                "external_id", t.externalId,
                "created_at", Json.ts(t.createdAt),
                "updated_at", Json.ts(t.updatedAt));
    }

    private static Map<String, Object> gain(EstimatedGain g) {
        return Json.obj(
                "id", g.id,
                "project_id", g.projectId,
                "item_name", g.itemName,
                "cost_mad", Json.dec(g.costMad),
                "formule", g.formule,
                "description", g.description,
                "created_at", Json.ts(g.createdAt),
                "updated_at", Json.ts(g.updatedAt));
    }

    private static Map<String, Object> infrastructureCost(InfrastructureCost c) {
        return Json.obj(
                "id", c.id,
                "project_id", c.projectId,
                "type", c.type,
                "item_name", c.itemName,
                "cost_mad", Json.dec(c.costMad),
                "formule", c.formule,
                "description", c.description,
                "created_at", Json.ts(c.createdAt),
                "updated_at", Json.ts(c.updatedAt));
    }

    private static Map<String, Object> roiProjection(RoiProjection r) {
        return Json.obj(
                "id", r.id,
                "project_id", r.projectId,
                "year_number", r.yearNumber,
                "cumulative_costs", Json.dec(r.cumulativeCosts),
                "cumulative_gains", Json.dec(r.cumulativeGains),
                "net_cash_flow", Json.dec(r.netCashFlow),
                "roi_percentage", Json.dec(r.roiPercentage),
                "created_at", Json.ts(r.createdAt),
                "updated_at", Json.ts(r.updatedAt));
    }

    private static Map<String, Object> kpi(ProjectKpi k) {
        return Json.obj(
                "id", k.id,
                "project_id", k.projectId,
                "metric_name", k.metricName,
                "target_value", k.targetValue,
                "measurement_method", k.measurementMethod,
                "created_at", Json.ts(k.createdAt),
                "updated_at", Json.ts(k.updatedAt));
    }

    private static Map<String, Object> risk(ProjectRisk r) {
        return Json.obj(
                "id", r.id,
                "project_id", r.projectId,
                "risk_name", r.riskName,
                "impact", r.impact,
                "probability", r.probability,
                "mitigation_strategy", r.mitigationStrategy,
                "created_at", Json.ts(r.createdAt),
                "updated_at", Json.ts(r.updatedAt));
    }

    // ------------------------------------------------------------------ helpers

    /** Decodes a json column like Eloquent's "array" cast. */
    public Object parseJson(String json) {
        return json == null ? null : jsonMapper.readValue(json, Object.class);
    }

    private static <T> void put(List<Map<String, Object>> views, List<T> models, String key, Function<T, Object> value) {
        for (int i = 0; i < models.size(); i++) {
            views.get(i).put(key, value.apply(models.get(i)));
        }
    }

    private static <T extends TimestampedEntity> Map<Long, T> byId(Collection<T> list) {
        return list.stream().collect(Collectors.toMap(e -> e.id, e -> e, (a, b) -> a));
    }

    private static <T> List<Long> ids(Collection<T> list, Function<T, Long> key) {
        return list.stream().map(key).filter(java.util.Objects::nonNull).distinct().toList();
    }

    private static <T> Map<Long, List<T>> group(List<T> list, Function<T, Long> key) {
        return list.stream().collect(Collectors.groupingBy(key));
    }
}
