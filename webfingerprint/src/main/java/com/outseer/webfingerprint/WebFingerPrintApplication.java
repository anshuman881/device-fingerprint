package com.outseer.webfingerprint;

import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.concurrent.ConcurrentMapCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.core.env.Environment;

import com.outseer.webfingerprint.service.LoggingService;

@SpringBootApplication
@EnableCaching
public class WebFingerPrintApplication implements CommandLineRunner {

    public static void main(String[] args) {
        SpringApplication.run(WebFingerPrintApplication.class, args);
    }

    @Bean
    public CacheManager cacheManager() {
        return new ConcurrentMapCacheManager("devices");
    }

    @Override
    public void run(String... args) {
        new Thread(this::cleanupJob).start();
    }

    private void cleanupJob() {
        System.out.println("cleanupJob Started....");
        long endTime = System.currentTimeMillis() + (60 * 1000);
        while (System.currentTimeMillis() < endTime) {
            System.out.println("Running cleanup logic...");
            try {
                Thread.sleep(2000);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                break;
            }
        }
        System.out.println("cleanupJob Ended....");
        System.exit(0);
    }

    @Bean
    public ApplicationRunner applicationRunner(LoggingService loggingService, Environment environment) {
        return args -> {
            String version = getClass().getPackage().getImplementationVersion();
            if (version == null) {
                version = "1.0.0";
            }
            String profile = environment.getActiveProfiles().length > 0
                    ? environment.getActiveProfiles()[0] : "default";

            loggingService.applicationStartup(version, profile);
            loggingService.info("WebFingerprint application started successfully on port: {}",
                    environment.getProperty("server.port", "8080"));
        };
    }
}
