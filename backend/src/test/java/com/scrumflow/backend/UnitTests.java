package com.scrumflow.backend;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.Test;

import com.scrumflow.backend.domain.Project;
import com.scrumflow.backend.support.ApiException;
import com.scrumflow.backend.support.Input;
import com.scrumflow.backend.support.Validation;
import com.scrumflow.backend.support.Validator;

/** Database-free tests of the Laravel-compatibility helpers. */
class UnitTests {

    private static Validator validator(Map<String, Object> data) {
        // exists/unique rules are not used here, so no database is needed
        return new Validation(null).make(new Input(data));
    }

    @Test
    void validatorMessagesMatchLaravel() {
        Map<String, Object> data = new LinkedHashMap<>();
        data.put("first_name", "   ");
        data.put("password", "abc");
        data.put("password_confirmation", "abd");
        data.put("salary", "ten");
        Validator v = validator(data)
                .rule("first_name", "required|string|max:255")
                .rule("password", "required|min:6|confirmed")
                .rule("salary", "required|numeric")
                .rule("is_engaged", "sometimes|boolean");

        assertThat(v.errors()).containsOnlyKeys("first_name", "password", "salary");
        assertThat(v.errors().get("first_name")).containsExactly("The first name field is required.");
        assertThat(v.errors().get("password")).containsExactly(
                "The password field must be at least 6 characters.",
                "The password field confirmation does not match.");
        assertThatThrownBy(v::validate).isInstanceOfSatisfying(ApiException.class, e ->
                assertThat(e.body().get("message")).isEqualTo("The first name field is required. (and 3 more errors)"));
    }

    @Test
    void inputTrimsAndNullsEmptyStringsButNotPasswords() {
        Input in = new Input(Map.of("name", "  Ana ", "empty", "", "password", " p ",
                "nested", Map.of("x", " y "), "list", List.of(" a ", "")));
        assertThat(in.get("name")).isEqualTo("Ana");
        assertThat(in.has("empty")).isTrue();
        assertThat(in.get("empty")).isNull();
        assertThat(in.get("password")).isEqualTo(" p ");
        assertThat(((Map<?, ?>) in.get("nested")).get("x")).isEqualTo("y");
        assertThat(in.get("list")).isEqualTo(java.util.Arrays.asList("a", null));
    }

    @Test
    void plannedEndDateFollowsCarbonSemantics() {
        Project p = new Project();
        p.startDate = LocalDate.of(2026, 1, 31);
        p.estimatedDurationMonths = new BigDecimal("1.00");
        p.computePlannedEndDate();
        assertThat(p.plannedEndDate).isEqualTo(LocalDate.of(2026, 3, 3));

        p.startDate = LocalDate.of(2026, 10, 18);
        p.estimatedDurationMonths = new BigDecimal("6.50"); // PHP round(): half away from zero
        p.computePlannedEndDate();
        assertThat(p.plannedEndDate).isEqualTo(LocalDate.of(2027, 5, 18));
    }
}
