package com.scrumflow.backend;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import com.scrumflow.backend.repository.UserRepository;

import tools.jackson.databind.JsonNode;

class ProjectApiTest extends ApiTestBase {

    @Autowired
    private UserRepository users;

    private static Map<String, Object> blueprint() {
        return Map.of(
                "project_name", "Blueprint",
                "description", "From the AI wizard",
                "start_date", "2026-01-31",
                "estimated_duration_months", 1,
                "total_project_cost", 1000,
                "roi_analysis_summary", List.of("line one", "line two"),
                "selected_engineers", List.of(Map.of("role", "Backend Developer", "level", "Senior", "months_assigned", 2)),
                "roi_projections", Map.of("break_even_point_months", 18,
                        "year_3", Map.of("cumulative_costs", 10, "cumulative_gains", 20, "net_cash_flow", 10, "roi_percentage", 12.5)),
                "kpis", List.of(Map.of("metric_name", "Adoption", "target_value", "80%", "measurement_method", "Logs")),
                "backlog", List.of(Map.of("id", "E-1", "title", "Epic", "description", "D",
                        "user_stories", List.of(Map.of("id", "US-1", "title", "Story", "description", "SD",
                                "story_points", 5, "acceptance_criteria", List.of("a", "b"),
                                "tasks", List.of(Map.of("id", "T-1", "role", "QA Engineer", "title", "Test it",
                                        "instructions", List.of("step 1", "step 2"), "hours", 3)))))));
    }

    @Test
    void storesBlueprintWithAllRelations() {
        Session s = register(uniqueEmail("bp"));
        Response r = call("POST", "/api/projects", blueprint(), s.token());
        assertThat(r.status()).isEqualTo(201);

        JsonNode p = r.json().get("project");
        assertThat(p.get("name").asString()).isEqualTo("Blueprint");
        // Carbon month overflow: 31 January + 1 month = 3 March
        assertThat(p.get("planned_end_date").asString()).isEqualTo("2026-03-03");
        assertThat(p.get("roi_percentage").asString()).isEqualTo("12.50");
        assertThat(p.get("break_even_point_months").asString()).isEqualTo("18.00");
        assertThat(p.get("roi_analysis_summary").asString()).isEqualTo("line one\nline two");
        assertThat(p.get("chef").get("email").asString()).contains("bp-");

        JsonNode engineer = p.get("assigned_engineers").get(0);
        assertThat(engineer.get("phase").asString()).isEqualTo("development");
        assertThat(engineer.get("specialization").get("salary").asString()).isEqualTo("25000.00");
        assertThat(engineer.get("total_cost").asDouble()).isEqualTo(50000.0);

        assertThat(p.get("roi_projections").get(0).get("year_number").asInt()).isEqualTo(3);
        JsonNode story = p.get("epics").get(0).get("stories").get(0);
        assertThat(story.get("acceptance_criteria").get(1).asString()).isEqualTo("b");
        assertThat(story.get("tasks").get(0).get("instructions").asString()).isEqualTo("step 1\nstep 2");
    }

    @Test
    void ownersOnly() {
        Session owner = register(uniqueEmail("owner"));
        Session other = register(uniqueEmail("other"));
        long id = call("POST", "/api/projects", blueprint(), owner.token()).json().get("project").get("id").asLong();

        Response forbidden = call("GET", "/api/projects/" + id, null, other.token());
        assertThat(forbidden.status()).isEqualTo(403);
        assertThat(forbidden.json().get("message").asString()).isEqualTo("Unauthorized access to this project");
        assertThat(call("GET", "/api/projects/999999999", null, owner.token()).status()).isEqualTo(404);
    }

    @Test
    void ownerCannotBeChangedThroughTheApi() {
        Session owner = register(uniqueEmail("keep"));
        Session other = register(uniqueEmail("receiver"));
        long otherId = call("GET", "/api/me", null, other.token()).json().get("id").asLong();

        Map<String, Object> created = new java.util.HashMap<>(blueprint());
        created.put("user_id", otherId);
        long id = call("POST", "/api/projects", created, owner.token()).json().get("project").get("id").asLong();
        assertThat(call("PUT", "/api/projects/" + id, Map.of("name", "Still mine", "user_id", otherId), owner.token()).status())
                .isEqualTo(200);

        assertThat(call("GET", "/api/projects/" + id, null, owner.token()).status()).isEqualTo(200);
        assertThat(call("GET", "/api/projects/" + id, null, other.token()).status()).isEqualTo(403);
    }

    @Test
    void updateReplacesBacklogAndStackIsSaved() {
        Session s = register(uniqueEmail("upd"));
        long id = call("POST", "/api/projects", blueprint(), s.token()).json().get("project").get("id").asLong();

        Response bad = call("PUT", "/api/projects/" + id, Map.of("start_date", "2026-05-01", "planned_end_date", "2026-01-01"), s.token());
        assertThat(bad.status()).isEqualTo(422);
        assertThat(bad.json().get("errors").get("planned_end_date").get(0).asString())
                .isEqualTo("The planned end date field must be a date after or equal to start date.");

        Response updated = call("PUT", "/api/projects/" + id, Map.of("name", "Renamed",
                "backlog", List.of(Map.of("title", "New epic", "description", "x"))), s.token());
        assertThat(updated.status()).isEqualTo(200);
        assertThat(updated.json().get("project").get("epics")).hasSize(1);
        assertThat(updated.json().get("project").get("epics").get(0).get("stories")).isEmpty();

        Response stack = call("POST", "/api/projects/" + id + "/stack", Map.of(
                "stack_analysis_data", Map.of("primary_recommendation", Map.of("strategy_name", "Spring Stack"))), s.token());
        assertThat(stack.json().get("project").get("stack_name").asString()).isEqualTo("Spring Stack");

        Response dashboard = call("GET", "/api/projects/dashboard", null, s.token());
        JsonNode row = dashboard.json().get("projects").get(0);
        assertThat(row.get("name").asString()).isEqualTo("Renamed");
        assertThat(row.get("status").asString()).isEqualTo("Ready to Execute");
        assertThat(row.get("has_stack").asBoolean()).isTrue();
        assertThat(dashboard.json().get("stats").get("total_projects").asInt()).isEqualTo(2);

        assertThat(call("DELETE", "/api/projects/" + id, null, s.token()).status()).isEqualTo(200);
        assertThat(call("GET", "/api/projects/" + id, null, s.token()).status()).isEqualTo(404);
    }

    @Test
    void teamAssignmentTogglesEngagement() {
        Session s = register(uniqueEmail("team"));
        long projectId = call("GET", "/api/projects", null, s.token()).json().get(0).get("id").asLong();
        long slot = call("GET", "/api/projects/" + projectId + "/team", null, s.token()).json().get("team").get(0).get("id").asLong();
        long employee = call("GET", "/api/employees", null, s.token()).json().get(0).get("id").asLong();

        Response assigned = call("POST", "/api/projects/" + projectId + "/team/assign",
                Map.of("assigned_engineer_id", slot, "user_id", employee), s.token());
        assertThat(assigned.status()).isEqualTo(200);
        assertThat(assigned.json().get("assignment").get("employee").get("is_engaged").asBoolean()).isTrue();
        assertThat(call("GET", "/api/employees/available", null, s.token()).json())
                .noneMatch(e -> e.get("id").asLong() == employee);

        call("POST", "/api/projects/" + projectId + "/team/unassign", Map.of("assigned_engineer_id", slot), s.token());
        assertThat(call("GET", "/api/employees/available", null, s.token()).json())
                .anyMatch(e -> e.get("id").asLong() == employee);
    }

    @Test
    void teamIsScopedToOwner() {
        Session owner = register(uniqueEmail("team-owner"));
        Session other = register(uniqueEmail("team-other"));
        long projectId = call("GET", "/api/projects", null, owner.token()).json().get(0).get("id").asLong();
        long slot = call("GET", "/api/projects/" + projectId + "/team", null, owner.token()).json().get("team").get(0).get("id").asLong();
        long otherEmployee = call("GET", "/api/employees", null, other.token()).json().get(0).get("id").asLong();

        assertThat(call("GET", "/api/projects/" + projectId + "/team", null, other.token()).status()).isEqualTo(403);
        assertThat(call("POST", "/api/projects/" + projectId + "/team/assign",
                Map.of("assigned_engineer_id", slot, "user_id", otherEmployee), other.token()).status()).isEqualTo(403);
        assertThat(call("POST", "/api/projects/" + projectId + "/team/unassign",
                Map.of("assigned_engineer_id", slot), other.token()).status()).isEqualTo(403);

        // The owner cannot staff their project with someone else's employee either
        assertThat(call("POST", "/api/projects/" + projectId + "/team/assign",
                Map.of("assigned_engineer_id", slot, "user_id", otherEmployee), owner.token()).status()).isEqualTo(404);
    }

    @Test
    void specializationWritesNeedAdmin() {
        String adminEmail = uniqueEmail("admin");
        Session chef = register(uniqueEmail("chef"));
        Session admin = register(adminEmail);
        users.findFirstByEmail(adminEmail).ifPresent(u -> {
            u.isAdmin = true;
            users.save(u);
        });
        long id = call("GET", "/api/specializations", null, chef.token()).json().get(0).get("id").asLong();

        assertThat(call("POST", "/api/specializations", Map.of("name", "X", "level", "Y", "salary", 1), chef.token()).status()).isEqualTo(403);
        assertThat(call("PUT", "/api/specializations/" + id, Map.of("salary", 1), chef.token()).status()).isEqualTo(403);
        assertThat(call("DELETE", "/api/specializations/" + id, null, chef.token()).status()).isEqualTo(403);
        assertThat(call("POST", "/api/specializations/bulk-delete", Map.of("ids", List.of(id)), chef.token()).status()).isEqualTo(403);

        Response created = call("POST", "/api/specializations",
                Map.of("name", "Test Role " + adminEmail, "level", "Senior", "salary", 1), admin.token());
        assertThat(created.status()).isEqualTo(201);
        long createdId = created.json().get("id").asLong();
        assertThat(call("DELETE", "/api/specializations/" + createdId, null, admin.token()).status()).isEqualTo(204);
    }

    @Test
    void employeeCrudIsScopedToOwner() {
        Session s = register(uniqueEmail("emp"));
        Session other = register(uniqueEmail("emp-other"));
        Response created = call("POST", "/api/employees", Map.of("first_name", "Eva", "last_name", "Moss",
                "email", "eva@x.io", "specialization_name", "QA Engineer", "level", "Senior"), s.token());
        assertThat(created.status()).isEqualTo(201);
        long id = created.json().get("user").get("id").asLong();
        assertThat(created.json().get("user").get("specialization").get("level").asString()).isEqualTo("Senior");

        Response foreign = call("PUT", "/api/employees/" + id, Map.of("first_name", "Hacked"), other.token());
        assertThat(foreign.status()).isEqualTo(404);
        assertThat(foreign.json().get("message").asString()).isEqualTo("No query results for model [App\\Models\\Employee] " + id);

        assertThat(call("DELETE", "/api/employees/" + id, null, s.token()).status()).isEqualTo(200);
    }
}
