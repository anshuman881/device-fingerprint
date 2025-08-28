package com.outseer.webfingerprint;

import com.outseer.webfingerprint.service.LoggingService;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.cache.CacheManager;
import org.springframework.cache.concurrent.ConcurrentMapCacheManager;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.env.Environment;

@SpringBootApplication
@EnableCaching
public class WebFingerPrintApplication {

	public static void main(String[] args) {
		SpringApplication.run(WebFingerPrintApplication.class, args);
	}

	@Bean
	public CacheManager cacheManager() {
		return new ConcurrentMapCacheManager("devices");
	}
	
	@Bean
	public ApplicationRunner applicationRunner(LoggingService loggingService, Environment environment) {
		return args -> {
			String version = getClass().getPackage().getImplementationVersion();
			if (version == null) {
				version = "1.0.0";
			}
			String profile = environment.getActiveProfiles().length > 0 ? 
				environment.getActiveProfiles()[0] : "default";
			
			loggingService.applicationStartup(version, profile);
			loggingService.info("WebFingerprint application started successfully on port: {}", 
				environment.getProperty("server.port", "8080"));
		};
	}
}
