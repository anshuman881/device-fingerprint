package com.outseer.webfingerprint.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

class LoggingServiceTest {

    private LoggingService loggingService;

    @BeforeEach
    void setUp() {
        loggingService = new LoggingService();
    }

    @Test
    void testBasicLogging() {
        // Test basic logging methods - these should not throw exceptions
        assertDoesNotThrow(() -> {
            loggingService.info("Test info message");
            loggingService.debug("Test debug message");
            loggingService.warn("Test warning message");
            loggingService.error("Test error message");
        });
    }

    @Test
    void testBusinessEventLogging() {
        // Test business event logging - should not throw exceptions
        assertDoesNotThrow(() -> {
            loggingService.businessEvent("TEST_EVENT", "Test business event");
            loggingService.deviceTracked("test-hash", "test-user-agent", 5);
            loggingService.newDeviceRegistered("new-hash", "new-user-agent");
        });
    }

    @Test
    void testSecurityEventLogging() {
        // Test security event logging - should not throw exceptions
        assertDoesNotThrow(() -> {
            loggingService.securityEvent("TEST_SECURITY", "Test security event");
            loggingService.failedAuthentication("test-user", "192.168.1.1", "Invalid password");
            loggingService.successfulAuthentication("test-user", "192.168.1.1");
        });
    }

    @Test
    void testPerformanceLogging() {
        // Test performance logging - should not throw exceptions
        assertDoesNotThrow(() -> {
            loggingService.performanceMetric("TEST_OPERATION", 150, "Test performance");
            loggingService.slowOperation("SLOW_OPERATION", 2000, 1000);
            loggingService.databaseOperation("SELECT", "User", 50);
        });
    }

    @Test
    void testApiLogging() {
        // Test API logging - should not throw exceptions
        String correlationId = "test-correlation-id";
        assertDoesNotThrow(() -> {
            loggingService.apiRequest("GET", "/api/test", correlationId);
            loggingService.apiResponse("GET", "/api/test", 200, 150, correlationId);
        });
    }

    @Test
    void testContextLogging() {
        // Test context logging - should not throw exceptions
        Map<String, String> context = Map.of("userId", "123", "action", "login");
        assertDoesNotThrow(() -> {
            loggingService.logWithContext("INFO", "Test context message", context);
        });
    }

    @Test
    void testCorrelationIdGeneration() {
        // Test correlation ID generation
        String correlationId = loggingService.generateCorrelationId();
        assertNotNull(correlationId);
        assertFalse(correlationId.isEmpty());
        assertTrue(correlationId.length() > 0);
    }
}
