package com.scrumflow.backend.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.scrumflow.backend.domain.AssignedEngineer;
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
import com.scrumflow.backend.repository.AssignedEngineerRepository;
import com.scrumflow.backend.repository.EstimatedGainRepository;
import com.scrumflow.backend.repository.InfrastructureCostRepository;
import com.scrumflow.backend.repository.ProjectBlueprintTaskRepository;
import com.scrumflow.backend.repository.ProjectEpicRepository;
import com.scrumflow.backend.repository.ProjectKpiRepository;
import com.scrumflow.backend.repository.ProjectRepository;
import com.scrumflow.backend.repository.ProjectRiskRepository;
import com.scrumflow.backend.repository.ProjectStoryRepository;
import com.scrumflow.backend.repository.RoiProjectionRepository;
import com.scrumflow.backend.repository.UserRepository;
import com.scrumflow.backend.support.Input;
import com.scrumflow.backend.support.Json;
import com.scrumflow.backend.support.Values;

import tools.jackson.databind.json.JsonMapper;

/** Project persistence: the AI blueprint import, updates, the stack choice and the dashboard. */
@Service
public class ProjectService {

    /**
     * Fields Project::create()/update() accepted from the request ($fillable). Not user_id: the owner
     * is always the authenticated chef, and a project cannot be handed to another account.
     */
    private static final String[] FILLABLE = {
            "name", "description", "start_date", "planned_end_date", "actual_end_date",
            "estimated_duration_months", "total_capex", "total_opex", "total_project_cost", "total_gain_value",
            "annual_opex_value", "roi_percentage", "break_even_point_months", "roi_analysis_summary",
            "architecture_plan", "recommended_stack", "stack_name", "stack_analysis_data",
    };

    /** Fields ProjectController::store() took from the request before the nested data. */
    private static final String[] STORE_FIELDS = {
            "name", "description", "start_date", "actual_end_date", "estimated_duration_months", "total_capex",
            "total_opex", "total_project_cost", "total_gain_value", "annual_opex_value", "roi_analysis_summary",
    };

    private final JsonMapper jsonMapper;
    private final ProjectRepository projects;
    private final UserRepository users;
    private final SpecializationService specializations;
    private final AssignedEngineerRepository engineers;
    private final EstimatedGainRepository gains;
    private final InfrastructureCostRepository infrastructure;
    private final RoiProjectionRepository roi;
    private final ProjectKpiRepository kpis;
    private final ProjectRiskRepository risks;
    private final ProjectEpicRepository epics;
    private final ProjectStoryRepository stories;
    private final ProjectBlueprintTaskRepository tasks;
    private final Views views;

    public ProjectService(JsonMapper jsonMapper, ProjectRepository projects, UserRepository users,
                          SpecializationService specializations, AssignedEngineerRepository engineers,
                          EstimatedGainRepository gains, InfrastructureCostRepository infrastructure,
                          RoiProjectionRepository roi, ProjectKpiRepository kpis, ProjectRiskRepository risks,
                          ProjectEpicRepository epics, ProjectStoryRepository stories,
                          ProjectBlueprintTaskRepository tasks, Views views) {
        this.jsonMapper = jsonMapper;
        this.projects = projects;
        this.users = users;
        this.specializations = specializations;
        this.engineers = engineers;
        this.gains = gains;
        this.infrastructure = infrastructure;
        this.roi = roi;
        this.kpis = kpis;
        this.risks = risks;
        this.epics = epics;
        this.stories = stories;
        this.tasks = tasks;
        this.views = views;
    }

    // ------------------------------------------------------------------ store

    /**
     * Saves a project and its AI analysis blueprint in one transaction: staffing (development and
     * maintenance), gains, infrastructure costs, ROI projections, KPIs, risks and the backlog
     * (epics, stories, tasks). Any failure rolls everything back.
     */
    @Transactional
    public Project createFromBlueprint(Input in, Long ownerId) {
        Map<String, Object> data = in.only(STORE_FIELDS);
        Object name = Values.truthy(in.str("name")) ? in.get("name") : in.get("project_name");
        data.put("name", name);
        if (name == null) {
            throw new IllegalArgumentException("The project name is still empty after synthesis. Please provide a name in Step 1.");
        }
        data.put("user_id", ownerId);

        if (in.get("roi_projections") instanceof Map<?, ?> roiData) {
            data.put("break_even_point_months", roiData.get("break_even_point_months"));
            if (roiData.get("year_3") instanceof Map<?, ?> year3 && year3.get("roi_percentage") != null) {
                data.put("roi_percentage", year3.get("roi_percentage"));
            }
        }

        Project project = new Project();
        fill(project, data);
        project.computePlannedEndDate();
        projects.save(project);

        if (in.has("selected_engineers")) {
            addEngineers(project, in.get("selected_engineers"), "development", 1);
        }
        if (in.has("maintenance_engineers")) {
            addEngineers(project, in.get("maintenance_engineers"), "maintenance", 12);
        }
        if (in.has("estimated_gains")) {
            for (Object item : items(in.get("estimated_gains"))) {
                Map<?, ?> g = map(item);
                EstimatedGain gain = new EstimatedGain();
                gain.projectId = project.id;
                gain.itemName = Values.str(Values.coalesce(g.get("item_name"), "Gain Item"));
                gain.costMad = Values.dec(Values.coalesce(g.get("cost_mad"), 0), 2);
                gain.formule = Values.str(g.get("formule"));
                gain.description = Values.str(g.get("description"));
                gains.save(gain);
            }
        }
        if (in.has("licenses_and_apis")) {
            addInfrastructure(project, in.get("licenses_and_apis"), "capex", "License");
        }
        if (in.has("cloud_subscription")) {
            addInfrastructure(project, in.get("cloud_subscription"), "opex", "Subscription");
        }
        if (in.get("roi_projections") instanceof Map<?, ?> projections) {
            for (Map.Entry<?, ?> entry : projections.entrySet()) {
                String key = String.valueOf(entry.getKey());
                if (key.startsWith("year_")) {
                    Map<?, ?> p = map(entry.getValue());
                    RoiProjection r = new RoiProjection();
                    r.projectId = project.id;
                    r.yearNumber = leadingInt(key.substring(5));
                    r.cumulativeCosts = Values.dec(Values.coalesce(p.get("cumulative_costs"), 0), 2);
                    r.cumulativeGains = Values.dec(Values.coalesce(p.get("cumulative_gains"), 0), 2);
                    r.netCashFlow = Values.dec(Values.coalesce(p.get("net_cash_flow"), 0), 2);
                    r.roiPercentage = Values.dec(Values.coalesce(p.get("roi_percentage"), 0), 2);
                    roi.save(r);
                }
            }
        }
        if (in.has("kpis")) {
            for (Object item : items(in.get("kpis"))) {
                Map<?, ?> k = map(item);
                ProjectKpi kpi = new ProjectKpi();
                kpi.projectId = project.id;
                kpi.metricName = Values.str(k.get("metric_name"));
                kpi.targetValue = Values.str(k.get("target_value"));
                kpi.measurementMethod = Values.str(k.get("measurement_method"));
                kpis.save(kpi);
            }
        }
        if (in.has("risk_assessment")) {
            for (Object item : items(in.get("risk_assessment"))) {
                Map<?, ?> r = map(item);
                ProjectRisk risk = new ProjectRisk();
                risk.projectId = project.id;
                risk.riskName = Values.str(r.get("risk_name"));
                risk.impact = Values.str(r.get("impact"));
                risk.probability = Values.str(r.get("probability"));
                risk.mitigationStrategy = Values.joinLines(Values.coalesce(r.get("mitigation_strategy"), ""));
                risks.save(risk);
            }
        }
        if (in.has("backlog")) {
            createBacklog(project.id, in.get("backlog"));
        }
        return project;
    }

    private void addEngineers(Project project, Object list, String phase, int defaultMonths) {
        for (Object item : items(list)) {
            Map<?, ?> eng = map(item);
            Specialization spec = specializations.firstOrCreate(
                    Values.str(Values.coalesce(eng.get("role"), eng.get("specialization"), "Unknown")),
                    Values.str(Values.coalesce(eng.get("level"), "Mid-level")),
                    Values.dec(Values.coalesce(eng.get("monthly_salary_mad"), eng.get("salary"), 0), 2));
            AssignedEngineer a = new AssignedEngineer();
            a.projectId = project.id;
            a.specializationId = spec.id;
            a.phase = phase;
            a.monthsAssigned = Values.dec(Values.coalesce(eng.get("months_assigned"), defaultMonths), 2);
            engineers.save(a);
        }
    }

    private void addInfrastructure(Project project, Object list, String type, String defaultName) {
        for (Object item : items(list)) {
            Map<?, ?> i = map(item);
            InfrastructureCost c = new InfrastructureCost();
            c.projectId = project.id;
            c.type = type;
            c.itemName = Values.str(Values.coalesce(i.get("item_name"), defaultName));
            c.costMad = Values.dec(Values.coalesce(i.get("cost_mad"), 0), 2);
            c.formule = Values.str(i.get("formule"));
            c.description = Values.str(i.get("description"));
            infrastructure.save(c);
        }
    }

    /** Creates epics, their user stories and the stories' tasks from the AI backlog structure. */
    private void createBacklog(Long projectId, Object backlog) {
        for (Object epicItem : items(backlog)) {
            Map<?, ?> epicData = map(epicItem);
            ProjectEpic epic = new ProjectEpic();
            epic.projectId = projectId;
            epic.title = Values.str(epicData.get("title"));
            epic.description = Values.str(epicData.get("description"));
            epic.externalId = Values.str(epicData.get("id"));
            epics.save(epic);

            for (Object storyItem : items(epicData.get("user_stories"))) {
                Map<?, ?> storyData = map(storyItem);
                ProjectStory story = new ProjectStory();
                story.projectEpicId = epic.id;
                story.title = Values.str(storyData.get("title"));
                story.description = Values.str(storyData.get("description"));
                story.storyPoints = Values.integer(Values.coalesce(storyData.get("story_points"), 0));
                story.acceptanceCriteria = toJson(Values.coalesce(storyData.get("acceptance_criteria"), List.of()));
                story.externalId = Values.str(storyData.get("id"));
                stories.save(story);

                for (Object taskItem : items(storyData.get("tasks"))) {
                    Map<?, ?> taskData = map(taskItem);
                    ProjectBlueprintTask task = new ProjectBlueprintTask();
                    task.projectStoryId = story.id;
                    task.role = Values.str(taskData.get("role"));
                    task.level = Values.str(taskData.get("level"));
                    task.title = Values.str(taskData.get("title"));
                    task.instructions = Values.joinLines(Values.coalesce(taskData.get("instructions"), ""));
                    task.hours = Values.integer(Values.coalesce(taskData.get("hours"), 0));
                    task.externalId = Values.str(taskData.get("id"));
                    tasks.save(task);
                }
            }
        }
    }

    // ------------------------------------------------------------------ update / stack / delete

    /** $project->update($request->all()), then replaces the backlog when one is sent. */
    @Transactional
    public Project update(Project project, Input in) {
        fill(project, in.only(FILLABLE));
        project.computePlannedEndDate();
        projects.saveAndFlush(project);
        if (in.has("backlog")) {
            epics.deleteByProject(project.id);
            createBacklog(project.id, in.get("backlog"));
        }
        return project;
    }

    /** Saves the chosen technology stack (full AI analysis and/or the legacy fields). */
    @Transactional
    public Project saveStack(Project project, Input in) {
        if (in.has("stack_analysis_data")) {
            Object analysis = in.get("stack_analysis_data");
            project.stackAnalysisData = toJson(analysis);
            if (!in.has("stack_name") && analysis instanceof Map<?, ?> a
                    && a.get("primary_recommendation") instanceof Map<?, ?> primary
                    && primary.get("strategy_name") != null) {
                project.stackName = Values.str(primary.get("strategy_name"));
            }
        }
        if (in.has("stack_name")) {
            project.stackName = in.str("stack_name");
        }
        if (in.has("architecture_plan")) {
            project.architecturePlan = toJson(in.get("architecture_plan"));
        }
        if (in.has("recommended_stack")) {
            project.recommendedStack = toJson(in.get("recommended_stack"));
        }
        project.computePlannedEndDate();
        return projects.saveAndFlush(project);
    }

    @Transactional
    public void delete(Project project) {
        projects.deleteProject(project.id);
    }

    // ------------------------------------------------------------------ dashboard

    /** Portfolio totals and a per-project summary with an analysis-progress status. */
    @Transactional(readOnly = true)
    public Map<String, Object> dashboard(Long userId) {
        List<Project> list = projects.findByUserIdOrderByCreatedAtDescIdDesc(userId);
        List<Map<String, Object>> loaded = views.projects(list, Views.Rel.CHEF, Views.Rel.EPICS_STORIES);
        List<Long> ids = list.stream().map(p -> p.id).toList();

        double totalCost = sum(list.stream().map(p -> p.totalProjectCost).toList());
        double totalGains = sum(list.stream().map(p -> p.totalGainValue).toList());
        List<BigDecimal> rois = list.stream().map(p -> p.roiPercentage).filter(Objects::nonNull).toList();
        double averageRoi = rois.isEmpty() ? 0 : sum(rois) / rois.size();
        long engineerCount = ids.isEmpty() ? 0 : engineers.countDistinctEmployees(ids);
        long userCount = Math.max(users.count(), 1);

        List<Map<String, Object>> projectsData = new ArrayList<>();
        for (int i = 0; i < list.size(); i++) {
            Project p = list.get(i);
            Map<String, Object> view = loaded.get(i);
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> epicViews = (List<Map<String, Object>>) view.get("epics");
            @SuppressWarnings("unchecked")
            Map<String, Object> chef = (Map<String, Object>) view.get("chef");

            boolean hasSummary = Values.truthy(p.roiAnalysisSummary);
            boolean hasArchitecture = !isEmptyJson(view.get("architecture_plan"));
            String status = "Planning";
            if (hasSummary && !epicViews.isEmpty()) {
                status = "Ready to Execute";
            } else if (hasSummary) {
                status = "Blueprint Analysis";
            } else if (hasArchitecture) {
                status = "Stack Defined";
            }

            projectsData.add(Json.obj(
                    "id", p.id,
                    "name", p.name,
                    "progress", 0,
                    "status", status,
                    "roi", Json.dec(p.roiPercentage),
                    "cost", Json.dec(p.totalProjectCost),
                    "chef", chef == null ? "Unassigned" : chef.get("first_name") + " " + chef.get("last_name"),
                    "description", p.description,
                    "has_strategic", hasSummary,
                    "has_technical", !epicViews.isEmpty() || hasArchitecture,
                    "has_stack", Values.truthy(p.stackName),
                    "roadmap", epicViews.stream().map(e -> Json.obj(
                            "title", e.get("title"),
                            "description", e.get("description"),
                            "story_count", ((Collection<?>) e.get("stories")).size())).toList()));
        }

        return Json.obj(
                "stats", Json.obj(
                        "total_projects", list.size(),
                        "total_budget", totalCost,
                        "total_gains", totalGains,
                        "average_roi", BigDecimal.valueOf(averageRoi).setScale(2, RoundingMode.HALF_UP).doubleValue(),
                        "engineer_count", engineerCount,
                        "talent_utilization", engineerCount > 0 ? (double) Math.round((double) engineerCount / userCount * 100) : 0),
                "projects", projectsData);
    }

    // ------------------------------------------------------------------ helpers

    /** Mass assignment of fillable attributes, with the column types the database would coerce to. */
    private void fill(Project p, Map<String, Object> attrs) {
        attrs.forEach((key, value) -> {
            switch (key) {
                case "name" -> p.name = Values.str(value);
                case "description" -> p.description = Values.str(value);
                case "start_date" -> p.startDate = date(value);
                case "planned_end_date" -> p.plannedEndDate = date(value);
                case "actual_end_date" -> p.actualEndDate = date(value);
                case "user_id" -> p.userId = value == null ? null : Values.dec(value, 0).longValueExact();
                case "estimated_duration_months" -> p.estimatedDurationMonths = Values.dec(value, 2);
                case "total_capex" -> p.totalCapex = Values.dec(value, 2);
                case "total_opex" -> p.totalOpex = Values.dec(value, 2);
                case "total_project_cost" -> p.totalProjectCost = Values.dec(value, 2);
                case "total_gain_value" -> p.totalGainValue = Values.dec(value, 2);
                case "annual_opex_value" -> p.annualOpexValue = Values.dec(value, 2);
                case "roi_percentage" -> p.roiPercentage = Values.dec(value, 2);
                case "break_even_point_months" -> p.breakEvenPointMonths = Values.dec(value, 2);
                case "roi_analysis_summary" -> p.roiAnalysisSummary = Values.joinLines(value);
                case "architecture_plan" -> p.architecturePlan = toJson(value);
                case "recommended_stack" -> p.recommendedStack = toJson(value);
                case "stack_analysis_data" -> p.stackAnalysisData = toJson(value);
                case "stack_name" -> p.stackName = Values.str(value);
                default -> {
                    // not fillable
                }
            }
        });
    }

    private static java.time.LocalDate date(Object value) {
        if (value == null) {
            return null;
        }
        java.time.LocalDate d = Values.date(value);
        if (d == null) {
            throw new IllegalArgumentException("Invalid date: " + value);
        }
        return d;
    }

    private String toJson(Object value) {
        return value == null ? null : jsonMapper.writeValueAsString(value);
    }

    /** PHP foreach over an array: lists iterate their items, objects their values, null nothing. */
    private static Collection<?> items(Object value) {
        if (value == null) {
            return List.of();
        }
        if (value instanceof List<?> list) {
            return list;
        }
        if (value instanceof Map<?, ?> map) {
            return map.values();
        }
        throw new IllegalArgumentException("Expected an array but got: " + value);
    }

    private static Map<?, ?> map(Object value) {
        if (value instanceof Map<?, ?> m) {
            return m;
        }
        throw new IllegalArgumentException("Expected an object but got: " + value);
    }

    /** PHP (int) cast of a string: its leading digits, or 0. */
    private static int leadingInt(String s) {
        int end = 0;
        while (end < s.length() && Character.isDigit(s.charAt(end))) {
            end++;
        }
        return end == 0 ? 0 : Integer.parseInt(s.substring(0, end));
    }

    private static double sum(List<BigDecimal> values) {
        return values.stream().filter(Objects::nonNull).mapToDouble(BigDecimal::doubleValue).sum();
    }

    /** PHP empty() on a decoded json column. */
    private static boolean isEmptyJson(Object value) {
        return value == null
                || (value instanceof Collection<?> c && c.isEmpty())
                || (value instanceof Map<?, ?> m && m.isEmpty())
                || Boolean.FALSE.equals(value)
                || (value instanceof String s && (s.isEmpty() || s.equals("0")))
                || (value instanceof Number n && n.doubleValue() == 0);
    }
}
