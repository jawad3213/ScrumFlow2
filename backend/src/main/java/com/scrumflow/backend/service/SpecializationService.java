package com.scrumflow.backend.service;

import java.math.BigDecimal;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.scrumflow.backend.domain.Specialization;
import com.scrumflow.backend.repository.SpecializationRepository;

@Service
public class SpecializationService {

    private final SpecializationRepository specializations;

    public SpecializationService(SpecializationRepository specializations) {
        this.specializations = specializations;
    }

    /** Specialization::firstOrCreate(['name' => ..., 'level' => ...], ['salary' => ...]). */
    @Transactional
    public Specialization firstOrCreate(String name, String level, BigDecimal salary) {
        return specializations.findFirstByNameAndLevelOrderById(name, level).orElseGet(() -> {
            Specialization s = new Specialization();
            s.name = name;
            s.level = level;
            s.salary = salary;
            return specializations.save(s);
        });
    }

    /** Specialization::updateOrCreate(['name' => ..., 'level' => ...], ['salary' => ...]). */
    @Transactional
    public Specialization updateOrCreate(String name, String level, BigDecimal salary) {
        Specialization s = specializations.findFirstByNameAndLevelOrderById(name, level).orElseGet(Specialization::new);
        s.name = name;
        s.level = level;
        s.salary = salary;
        return specializations.save(s);
    }
}
