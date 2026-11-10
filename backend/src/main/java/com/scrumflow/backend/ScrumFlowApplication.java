package com.scrumflow.backend;

import java.util.TimeZone;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

@SpringBootApplication
@ConfigurationPropertiesScan
public class ScrumFlowApplication {

    static {
        // Laravel ran with app.timezone = UTC and stored timestamps without a zone, so the JVM must agree.
        // A static initializer also covers tests and any other way the application class is loaded.
        TimeZone.setDefault(TimeZone.getTimeZone("UTC"));
    }

    public static void main(String[] args) {
        SpringApplication.run(ScrumFlowApplication.class, args);
    }
}
