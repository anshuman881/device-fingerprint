package com.outseer.webfingerprint.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI deviceTrackingOpenAPI() {
        return new OpenAPI()
            .info(new Info()
                .title("Device Fingerprint Tracking API")
                .description("API for tracking and identifying devices using browser fingerprinting")
                .version("1.0")
                .contact(new Contact()
                    .name("Your Name")
                    .email("your.email@example.com")));
    }
}