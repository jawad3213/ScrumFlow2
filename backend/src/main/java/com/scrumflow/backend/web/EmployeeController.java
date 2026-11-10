package com.scrumflow.backend.web;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.scrumflow.backend.domain.Employee;
import com.scrumflow.backend.domain.Specialization;
import com.scrumflow.backend.repository.EmployeeRepository;
import com.scrumflow.backend.repository.SpecializationRepository;
import com.scrumflow.backend.security.AuthUser;
import com.scrumflow.backend.service.Views;
import com.scrumflow.backend.support.ApiException;
import com.scrumflow.backend.support.Input;
import com.scrumflow.backend.support.Json;
import com.scrumflow.backend.support.Validation;
import com.scrumflow.backend.support.Values;

/** The authenticated chef's team members. */
@RestController
@RequestMapping("/api/employees")
public class EmployeeController {

    private final EmployeeRepository employees;
    private final SpecializationRepository specializations;
    private final Validation validation;
    private final Views views;

    public EmployeeController(EmployeeRepository employees, SpecializationRepository specializations,
                              Validation validation, Views views) {
        this.employees = employees;
        this.specializations = specializations;
        this.validation = validation;
        this.views = views;
    }

    @GetMapping
    public List<Map<String, Object>> index(@AuthenticationPrincipal AuthUser me) {
        return views.employees(employees.findByUserIdOrderById(me.userId()));
    }

    /** Employees not currently assigned to a project role. */
    @GetMapping("/available")
    public List<Map<String, Object>> available(@AuthenticationPrincipal AuthUser me) {
        return views.employees(employees.findByUserIdAndIsEngagedOrderById(me.userId(), false));
    }

    @PostMapping
    @Transactional
    public ResponseEntity<Map<String, Object>> store(@AuthenticationPrincipal AuthUser me, Input in) {
        validation.make(in)
                .rule("first_name", "required|string|max:255")
                .rule("last_name", "required|string|max:255")
                .rule("email", "required|string|email|max:255")
                .rule("specialization_name", "required|string|exists:specializations,name")
                .rule("level", "required|string|exists:specializations,level")
                .validate();

        Specialization spec = findSpecialization(in);
        Employee e = new Employee();
        e.userId = me.userId();
        e.firstName = in.str("first_name");
        e.lastName = in.str("last_name");
        e.email = in.str("email");
        e.specializationId = spec.id;
        employees.save(e);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Json.obj("message", "Employé créé avec succès.", "user", views.employee(e)));
    }

    @PutMapping("/{id}")
    @Transactional
    public Map<String, Object> update(@AuthenticationPrincipal AuthUser me, @PathVariable Long id, Input in) {
        Employee e = owned(me, id);
        validation.make(in)
                .rule("first_name", "sometimes|required|string|max:255")
                .rule("last_name", "sometimes|required|string|max:255")
                .rule("specialization_name", "sometimes|required|string|exists:specializations,name")
                .rule("level", "sometimes|required|string|exists:specializations,level")
                .rule("is_engaged", "sometimes|boolean")
                .validate();

        if (in.has("first_name")) {
            e.firstName = in.str("first_name");
        }
        if (in.has("last_name")) {
            e.lastName = in.str("last_name");
        }
        if (in.has("is_engaged")) {
            e.isEngaged = Boolean.TRUE.equals(Values.bool(in.get("is_engaged")));
        }
        if (in.has("specialization_name") && in.has("level")) {
            e.specializationId = findSpecialization(in).id;
        }
        employees.saveAndFlush(e);

        return Json.obj("message", "Employé mis à jour avec succès.", "user", views.employee(e));
    }

    @DeleteMapping("/{id}")
    @Transactional
    public Map<String, Object> destroy(@AuthenticationPrincipal AuthUser me, @PathVariable Long id) {
        employees.delete(owned(me, id));
        return Json.obj("message", "Employé supprimé avec succès.");
    }

    @PostMapping("/bulk-delete")
    @Transactional
    public Map<String, Object> bulkDelete(@AuthenticationPrincipal AuthUser me, Input in) {
        validation.make(in).rule("ids", "required|array").rule("ids.*", "exists:employees,id").validate();
        List<Long> ids = ((List<?>) in.get("ids")).stream().map(v -> Values.dec(v, 0).longValueExact()).toList();
        employees.deleteOwned(me.userId(), ids);
        return Json.obj("message", "Employés supprimés avec succès.");
    }

    private Employee owned(AuthUser me, Long id) {
        return employees.findByIdAndUserId(id, me.userId()).orElseThrow(() -> ApiException.notFound("Employee", id));
    }

    private Specialization findSpecialization(Input in) {
        return specializations.findFirstByNameAndLevelOrderById(in.str("specialization_name"), in.str("level"))
                .orElseThrow(() -> ApiException.notFound("Specialization", null));
    }
}
