package com.scrumflow.backend.seed;

import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.support.TransactionTemplate;

import com.scrumflow.backend.config.AppProperties;
import com.scrumflow.backend.domain.User;
import com.scrumflow.backend.repository.ProjectRepository;
import com.scrumflow.backend.repository.UserRepository;
import com.scrumflow.backend.service.DemoDataService;
import com.scrumflow.backend.service.SpecializationService;
import com.scrumflow.backend.support.Values;

/**
 * Port of "php artisan db:seed": the specialization catalogue, the admin chef account, then the
 * demo project and employees for every chef that has no project yet. Runs at startup when
 * SEED_DATABASE=true, and is idempotent, so it can stay enabled; with SEED_EXIT=true the application
 * stops afterwards (one-off seeding job).
 */
@Component
public class DatabaseSeeder implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(DatabaseSeeder.class);

    private final AppProperties props;
    private final SpecializationService specializations;
    private final UserRepository users;
    private final ProjectRepository projects;
    private final PasswordEncoder passwords;
    private final DemoDataService demoData;
    private final TransactionTemplate tx;
    private final ConfigurableApplicationContext context;

    public DatabaseSeeder(AppProperties props, SpecializationService specializations, UserRepository users,
                          ProjectRepository projects, PasswordEncoder passwords, DemoDataService demoData,
                          TransactionTemplate tx, ConfigurableApplicationContext context) {
        this.props = props;
        this.specializations = specializations;
        this.users = users;
        this.projects = projects;
        this.passwords = passwords;
        this.demoData = demoData;
        this.tx = tx;
        this.context = context;
    }

    @Override
    public void run(ApplicationArguments args) throws Exception {
        if (!props.seed().enabled()) {
            return;
        }
        List<Map<String, Object>> catalogue = demoData.specializationCatalogue();
        tx.executeWithoutResult(status -> {
            for (Map<String, Object> s : catalogue) {
                specializations.updateOrCreate(Values.str(s.get("name")), Values.str(s.get("level")), Values.dec(s.get("salary"), 2));
            }
            log.info("Seeded {} specializations", catalogue.size());

            String email = props.seed().adminEmail();
            String password = AppProperties.clean(props.seed().adminPassword());
            if (password == null) {
                log.warn("SEED_ADMIN_PASSWORD is not set: the admin account {} is not created", email);
            } else if (users.findFirstByEmail(email).isEmpty()) {
                User admin = new User();
                admin.firstName = "Jaouad";
                admin.lastName = "El Hail";
                admin.email = email;
                admin.password = passwords.encode(password);
                admin.role = "chef";
                admin.isAdmin = true;
                users.save(admin);
            }
            // Also flags an admin account created before the is_admin column existed
            users.findFirstByEmail(email).filter(u -> !u.isAdmin).ifPresent(u -> {
                u.isAdmin = true;
                users.save(u);
            });

            // Only accounts without any project: seeding again (every restart) adds nothing
            for (User chef : users.findByRoleOrderById("chef")) {
                if (projects.existsByUserId(chef.id)) {
                    continue;
                }
                demoData.seedForUser(chef);
                log.info("Seeded project + employees for {} {}", chef.firstName, chef.lastName);
            }
        });

        if (props.seed().exitAfter()) {
            System.exit(SpringApplication.exit(context, () -> 0));
        }
    }
}
