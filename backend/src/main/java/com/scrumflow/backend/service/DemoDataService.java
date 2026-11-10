package com.scrumflow.backend.service;

import java.io.IOException;
import java.io.InputStream;
import java.security.SecureRandom;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import org.springframework.core.io.ClassPathResource;
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
import com.scrumflow.backend.domain.User;
import com.scrumflow.backend.repository.AssignedEngineerRepository;
import com.scrumflow.backend.repository.EmployeeRepository;
import com.scrumflow.backend.repository.EstimatedGainRepository;
import com.scrumflow.backend.repository.InfrastructureCostRepository;
import com.scrumflow.backend.repository.ProjectBlueprintTaskRepository;
import com.scrumflow.backend.repository.ProjectEpicRepository;
import com.scrumflow.backend.repository.ProjectKpiRepository;
import com.scrumflow.backend.repository.ProjectRepository;
import com.scrumflow.backend.repository.ProjectRiskRepository;
import com.scrumflow.backend.repository.ProjectStoryRepository;
import com.scrumflow.backend.repository.RoiProjectionRepository;
import com.scrumflow.backend.repository.SpecializationRepository;
import com.scrumflow.backend.support.Values;

import tools.jackson.databind.JsonNode;
import tools.jackson.databind.json.JsonMapper;

/**
 * Demo content created for every new account (port of ProjectSeederService and EmployeeSeederService).
 * The demo project lives in seed/demo-project.json, extracted verbatim from the old PHP seeder.
 */
@Service
public class DemoDataService {

    private static final List<String> FIRST_NAMES = List.of(
            "Amine", "Mehdi", "Youssef", "Hamza", "Omar", "Karim", "Hassan", "Othmane", "Ilyas", "Ayoub", "Yassine",
            "Walid", "Zakaria", "Badr", "Soufiane", "Sara", "Fatima", "Salma", "Kenza", "Meriem", "Houda", "Zineb",
            "Nada", "Meryem", "Kawtar", "Leila", "Imane", "Ghita", "Asmaa", "Rim");
    private static final List<String> LAST_NAMES = List.of(
            "El Fassi", "Benjelloun", "Berrada", "Tazi", "Chraibi", "Guessous", "Benkirane", "Tahiri", "Alaoui",
            "Amrani", "Lahlou", "Boujida", "Naciri", "Idrissi", "Ouazzani", "Benali", "Rhomari", "Bekkari", "Fettah",
            "Bennis");
    private static final SecureRandom RANDOM = new SecureRandom();

    private final JsonMapper jsonMapper;
    private final JsonNode demo;
    private final SpecializationService specializationService;
    private final SpecializationRepository specializations;
    private final EmployeeRepository employees;
    private final ProjectRepository projects;
    private final AssignedEngineerRepository engineers;
    private final InfrastructureCostRepository infrastructure;
    private final EstimatedGainRepository gains;
    private final RoiProjectionRepository roi;
    private final ProjectKpiRepository kpis;
    private final ProjectRiskRepository risks;
    private final ProjectEpicRepository epics;
    private final ProjectStoryRepository stories;
    private final ProjectBlueprintTaskRepository tasks;

    public DemoDataService(JsonMapper jsonMapper, SpecializationService specializationService,
                           SpecializationRepository specializations, EmployeeRepository employees,
                           ProjectRepository projects, AssignedEngineerRepository engineers,
                           InfrastructureCostRepository infrastructure, EstimatedGainRepository gains,
                           RoiProjectionRepository roi, ProjectKpiRepository kpis, ProjectRiskRepository risks,
                           ProjectEpicRepository epics, ProjectStoryRepository stories,
                           ProjectBlueprintTaskRepository tasks) throws IOException {
        this.jsonMapper = jsonMapper;
        this.specializationService = specializationService;
        this.specializations = specializations;
        this.employees = employees;
        this.projects = projects;
        this.engineers = engineers;
        this.infrastructure = infrastructure;
        this.gains = gains;
        this.roi = roi;
        this.kpis = kpis;
        this.risks = risks;
        this.epics = epics;
        this.stories = stories;
        this.tasks = tasks;
        try (InputStream in = new ClassPathResource("seed/demo-project.json").getInputStream()) {
            this.demo = jsonMapper.readTree(in);
        }
    }

    /** Seeds the pre-analysed demo project and one employee per specialization for a new user. */
    @Transactional
    public void seedForUser(User user) {
        seedProject(user);
        seedEmployees(user);
    }

    @Transactional
    public Project seedProject(User user) {
        JsonNode p = demo.get("project");
        Project project = new Project();
        project.name = text(p, "name");
        project.description = text(p, "description");
        project.userId = user.id;
        project.startDate = LocalDate.now(ZoneOffset.UTC);
        project.estimatedDurationMonths = dec(p, "estimated_duration_months");
        project.totalCapex = dec(p, "total_capex");
        project.totalOpex = dec(p, "total_opex");
        project.totalProjectCost = dec(p, "total_project_cost");
        project.totalGainValue = dec(p, "total_gain_value");
        project.annualOpexValue = dec(p, "annual_opex_value");
        project.roiPercentage = dec(p, "roi_percentage");
        project.breakEvenPointMonths = dec(p, "break_even_point_months");
        project.roiAnalysisSummary = text(p, "roi_analysis_summary");
        project.stackName = text(p, "stack_name");
        project.stackAnalysisData = jsonMapper.writeValueAsString(p.get("stack_analysis_data"));
        project.computePlannedEndDate();
        projects.save(project);

        for (JsonNode e : demo.get("assigned_engineers")) {
            Specialization spec = specializationService.firstOrCreate(text(e, "role"), text(e, "level"), dec(e, "salary"));
            AssignedEngineer a = new AssignedEngineer();
            a.projectId = project.id;
            a.specializationId = spec.id;
            a.phase = text(e, "phase");
            a.monthsAssigned = dec(e, "months_assigned");
            engineers.save(a);
        }
        for (JsonNode c : demo.get("infrastructure_costs")) {
            InfrastructureCost cost = new InfrastructureCost();
            cost.projectId = project.id;
            cost.type = text(c, "type");
            cost.itemName = text(c, "item_name");
            cost.costMad = dec(c, "cost_mad");
            cost.formule = text(c, "formule");
            cost.description = text(c, "description");
            infrastructure.save(cost);
        }
        for (JsonNode g : demo.get("estimated_gains")) {
            EstimatedGain gain = new EstimatedGain();
            gain.projectId = project.id;
            gain.itemName = text(g, "item_name");
            gain.costMad = dec(g, "cost_mad");
            gain.formule = text(g, "formule");
            gain.description = text(g, "description");
            gains.save(gain);
        }
        for (JsonNode r : demo.get("roi_projections")) {
            RoiProjection projection = new RoiProjection();
            projection.projectId = project.id;
            projection.yearNumber = r.get("year_number").asInt();
            projection.cumulativeCosts = dec(r, "cumulative_costs");
            projection.cumulativeGains = dec(r, "cumulative_gains");
            projection.netCashFlow = dec(r, "net_cash_flow");
            projection.roiPercentage = dec(r, "roi_percentage");
            roi.save(projection);
        }
        for (JsonNode k : demo.get("kpis")) {
            ProjectKpi kpi = new ProjectKpi();
            kpi.projectId = project.id;
            kpi.metricName = text(k, "metric_name");
            kpi.targetValue = text(k, "target_value");
            kpi.measurementMethod = text(k, "measurement_method");
            kpis.save(kpi);
        }
        for (JsonNode r : demo.get("risks")) {
            ProjectRisk risk = new ProjectRisk();
            risk.projectId = project.id;
            risk.riskName = text(r, "risk_name");
            risk.impact = text(r, "impact");
            risk.probability = text(r, "probability");
            risk.mitigationStrategy = text(r, "mitigation_strategy");
            risks.save(risk);
        }
        for (JsonNode e : demo.get("epics")) {
            ProjectEpic epic = new ProjectEpic();
            epic.projectId = project.id;
            epic.title = text(e, "title");
            epic.description = text(e, "description");
            epic.externalId = text(e, "external_id");
            epics.save(epic);
            for (JsonNode s : e.get("stories")) {
                ProjectStory story = new ProjectStory();
                story.projectEpicId = epic.id;
                story.title = text(s, "title");
                story.description = text(s, "description");
                story.storyPoints = s.get("story_points").asInt();
                story.acceptanceCriteria = jsonMapper.writeValueAsString(s.get("acceptance_criteria"));
                story.externalId = text(s, "external_id");
                stories.save(story);
                for (JsonNode t : s.get("tasks")) {
                    ProjectBlueprintTask task = new ProjectBlueprintTask();
                    task.projectStoryId = story.id;
                    task.role = text(t, "role");
                    task.level = text(t, "level");
                    task.title = text(t, "title");
                    task.instructions = text(t, "instructions");
                    task.hours = t.get("hours").asInt();
                    task.externalId = text(t, "external_id");
                    tasks.save(task);
                }
            }
        }
        return project;
    }

    /** One employee with a random Moroccan name for every specialization the user has none of. */
    @Transactional
    public void seedEmployees(User user) {
        for (Specialization spec : specializations.findAllByOrderById()) {
            if (employees.countByUserIdAndSpecializationId(user.id, spec.id) > 0) {
                continue;
            }
            String first = FIRST_NAMES.get(RANDOM.nextInt(FIRST_NAMES.size()));
            String last = LAST_NAMES.get(RANDOM.nextInt(LAST_NAMES.size()));
            Employee e = new Employee();
            e.userId = user.id;
            e.firstName = first;
            e.lastName = last;
            e.email = (first + "." + last).replace(" ", "").toLowerCase(Locale.ROOT) + "@growtrack.com";
            e.specializationId = spec.id;
            e.isEngaged = false;
            employees.save(e);
        }
    }

    /** The specialization catalogue (seed/specializations.json) used by the database seeder. */
    public List<Map<String, Object>> specializationCatalogue() throws IOException {
        try (InputStream in = new ClassPathResource("seed/specializations.json").getInputStream()) {
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> list = jsonMapper.readValue(in, List.class);
            return list;
        }
    }

    private static String text(JsonNode node, String field) {
        JsonNode v = node.get(field);
        return v == null || v.isNull() ? null : v.asString();
    }

    private static java.math.BigDecimal dec(JsonNode node, String field) {
        JsonNode v = node.get(field);
        return v == null || v.isNull() ? null : Values.dec(v.asString(), 2);
    }
}
