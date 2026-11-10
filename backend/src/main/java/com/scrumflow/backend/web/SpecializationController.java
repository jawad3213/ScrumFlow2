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

import com.scrumflow.backend.domain.Specialization;
import com.scrumflow.backend.repository.SpecializationRepository;
import com.scrumflow.backend.repository.UserRepository;
import com.scrumflow.backend.security.AuthUser;
import com.scrumflow.backend.service.Views;
import com.scrumflow.backend.support.ApiException;
import com.scrumflow.backend.support.Input;
import com.scrumflow.backend.support.Validation;
import com.scrumflow.backend.support.Values;

/** The shared catalogue of roles, levels and monthly salaries. */
@RestController
@RequestMapping("/api/specializations")
public class SpecializationController {

    private final SpecializationRepository specializations;
    private final UserRepository users;
    private final Validation validation;
    private final Views views;

    public SpecializationController(SpecializationRepository specializations, UserRepository users,
                                    Validation validation, Views views) {
        this.specializations = specializations;
        this.users = users;
        this.validation = validation;
        this.views = views;
    }

    @GetMapping
    public List<Map<String, Object>> index() {
        return views.specializations(specializations.findAllByOrderById());
    }

    @PostMapping
    @Transactional
    public ResponseEntity<Map<String, Object>> store(@AuthenticationPrincipal AuthUser me, Input in) {
        requireAdmin(me);
        validation.make(in)
                .rule("name", "required|string|max:255")
                .rule("level", "required|string|max:255")
                .rule("salary", "required|numeric")
                .validate();
        Specialization s = new Specialization();
        fill(s, in);
        specializations.save(s);
        return ResponseEntity.status(HttpStatus.CREATED).body(views.specialization(s));
    }

    @PutMapping("/{id}")
    @Transactional
    public Map<String, Object> update(@AuthenticationPrincipal AuthUser me, @PathVariable Long id, Input in) {
        requireAdmin(me);
        Specialization s = specializations.findById(id).orElseThrow(() -> ApiException.notFound("Specialization", id));
        validation.make(in)
                .rule("name", "sometimes|required|string|max:255")
                .rule("level", "sometimes|required|string|max:255")
                .rule("salary", "sometimes|required|numeric")
                .validate();
        fill(s, in);
        specializations.saveAndFlush(s);
        return views.specialization(s);
    }

    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<Void> destroy(@AuthenticationPrincipal AuthUser me, @PathVariable Long id) {
        requireAdmin(me);
        Specialization s = specializations.findById(id).orElseThrow(() -> ApiException.notFound("Specialization", id));
        specializations.deleteByIds(List.of(s.id));
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/bulk-delete")
    @Transactional
    public ResponseEntity<Void> bulkDestroy(@AuthenticationPrincipal AuthUser me, Input in) {
        requireAdmin(me);
        validation.make(in).rule("ids", "required|array").rule("ids.*", "exists:specializations,id").validate();
        List<Long> ids = ((List<?>) in.get("ids")).stream().map(v -> Values.dec(v, 0).longValueExact()).toList();
        specializations.deleteByIds(ids);
        return ResponseEntity.noContent().build();
    }

    /** The catalogue is shared by every chef, so only admins may change it. */
    private void requireAdmin(AuthUser me) {
        if (!users.findById(me.userId()).map(u -> u.isAdmin).orElse(false)) {
            throw ApiException.of(HttpStatus.FORBIDDEN, "Only an administrator can change specializations.");
        }
    }

    /** Mass assignment of the fillable fields present in the request. */
    private static void fill(Specialization s, Input in) {
        if (in.has("name")) {
            s.name = in.str("name");
        }
        if (in.has("level")) {
            s.level = in.str("level");
        }
        if (in.has("salary")) {
            s.salary = Values.dec(in.get("salary"), 2);
        }
    }
}
