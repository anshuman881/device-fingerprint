package com.outseer.webfingerprint.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Map;
import java.util.UUID;

/**
 * Comprehensive logging service for the WebFingerprint application.
 * Provides structured logging with different levels and specialized logging capabilities.
 */
@Service
public class LoggingService {
    
    private static final Logger logger = LoggerFactory.getLogger(LoggingService.class);
    private static final Logger securityLogger = LoggerFactory.getLogger("com.outseer.webfingerprint.security");
    private static final Logger performanceLogger = LoggerFactory.getLogger("com.outseer.webfingerprint.performance");
    private static final Logger businessLogger = LoggerFactory.getLogger("com.outseer.webfingerprint.business");
    
    private static final DateTimeFormatter TIMESTAMP_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss.SSS");
    
    /**
     * Logs a general information message
     */
    public void info(String message) {
        logger.info(message);
    }
    
    /**
     * Logs a general information message with parameters
     */
    public void info(String message, Object... args) {
        logger.info(message, args);
    }
    
    /**
     * Logs a debug message
     */
    public void debug(String message) {
        logger.debug(message);
    }
    
    /**
     * Logs a debug message with parameters
     */
    public void debug(String message, Object... args) {
        logger.debug(message, args);
    }
    
    /**
     * Logs a warning message
     */
    public void warn(String message) {
        logger.warn(message);
    }
    
    /**
     * Logs a warning message with parameters
     */
    public void warn(String message, Object... args) {
        logger.warn(message, args);
    }
    
    /**
     * Logs an error message
     */
    public void error(String message) {
        logger.error(message);
    }
    
    /**
     * Logs an error message with parameters
     */
    public void error(String message, Object... args) {
        logger.error(message, args);
    }
    
    /**
     * Logs an error message with exception
     */
    public void error(String message, Throwable throwable) {
        logger.error(message, throwable);
    }
    
    /**
     * Logs a security event
     */
    public void securityEvent(String event, String details) {
        securityLogger.info("SECURITY_EVENT: {} - {}", event, details);
    }
    
    /**
     * Logs a security event with additional context
     */
    public void securityEvent(String event, String details, Map<String, String> context) {
        try {
            context.forEach(MDC::put);
            securityLogger.info("SECURITY_EVENT: {} - {} - Context: {}", event, details, context);
        } finally {
            context.keySet().forEach(MDC::remove);
        }
    }
    
    /**
     * Logs a failed authentication attempt
     */
    public void failedAuthentication(String username, String ipAddress, String reason) {
        securityEvent("AUTH_FAILED", 
            String.format("Failed authentication for user: %s from IP: %s", username, ipAddress), 
            Map.of("username", username, "ipAddress", ipAddress, "reason", reason));
    }
    
    /**
     * Logs a successful authentication
     */
    public void successfulAuthentication(String username, String ipAddress) {
        securityEvent("AUTH_SUCCESS", 
            String.format("Successful authentication for user: %s from IP: %s", username, ipAddress),
            Map.of("username", username, "ipAddress", ipAddress));
    }
    
    /**
     * Logs a performance metric
     */
    public void performanceMetric(String operation, long durationMs, String details) {
        performanceLogger.info("PERFORMANCE: {} took {}ms - {}", operation, durationMs, details);
    }
    
    /**
     * Logs a slow operation warning
     */
    public void slowOperation(String operation, long durationMs, long thresholdMs) {
        if (durationMs > thresholdMs) {
            performanceLogger.warn("SLOW_OPERATION: {} took {}ms (threshold: {}ms)", operation, durationMs, thresholdMs);
        }
    }
    
    /**
     * Logs a business event
     */
    public void businessEvent(String event, String details) {
        businessLogger.info("BUSINESS_EVENT: {} - {}", event, details);
    }
    
    /**
     * Logs a business event with additional context
     */
    public void businessEvent(String event, String details, Map<String, Object> context) {
        try {
            context.forEach((key, value) -> MDC.put(key, String.valueOf(value)));
            businessLogger.info("BUSINESS_EVENT: {} - {} - Context: {}", event, details, context);
        } finally {
            context.keySet().forEach(MDC::remove);
        }
    }
    
    /**
     * Logs device tracking events
     */
    public void deviceTracked(String deviceHash, String userAgent, int visitCount) {
        businessEvent("DEVICE_TRACKED", 
            String.format("Device %s tracked, visit count: %d", deviceHash, visitCount),
            Map.of("deviceHash", deviceHash, "userAgent", userAgent, "visitCount", visitCount));
    }
    
    /**
     * Logs new device registration
     */
    public void newDeviceRegistered(String deviceHash, String userAgent) {
        businessEvent("NEW_DEVICE", 
            String.format("New device registered: %s", deviceHash),
            Map.of("deviceHash", deviceHash, "userAgent", userAgent));
    }
    
    /**
     * Logs API request with correlation ID
     */
    public void apiRequest(String method, String path, String correlationId) {
        try {
            MDC.put("correlationId", correlationId);
            MDC.put("requestMethod", method);
            MDC.put("requestPath", path);
            logger.info("API_REQUEST: {} {} - CorrelationId: {}", method, path, correlationId);
        } finally {
            MDC.remove("correlationId");
            MDC.remove("requestMethod");
            MDC.remove("requestPath");
        }
    }
    
    /**
     * Logs API response with correlation ID
     */
    public void apiResponse(String method, String path, int statusCode, long durationMs, String correlationId) {
        try {
            MDC.put("correlationId", correlationId);
            MDC.put("requestMethod", method);
            MDC.put("requestPath", path);
            MDC.put("responseStatus", String.valueOf(statusCode));
            MDC.put("responseTime", String.valueOf(durationMs));
            
            if (statusCode >= 400) {
                logger.warn("API_RESPONSE: {} {} - Status: {} - Duration: {}ms - CorrelationId: {}", 
                    method, path, statusCode, durationMs, correlationId);
            } else {
                logger.info("API_RESPONSE: {} {} - Status: {} - Duration: {}ms - CorrelationId: {}", 
                    method, path, statusCode, durationMs, correlationId);
            }
        } finally {
            MDC.remove("correlationId");
            MDC.remove("requestMethod");
            MDC.remove("requestPath");
            MDC.remove("responseStatus");
            MDC.remove("responseTime");
        }
    }
    
    /**
     * Logs database operations
     */
    public void databaseOperation(String operation, String entity, long durationMs) {
        performanceMetric("DB_" + operation, durationMs, "Entity: " + entity);
    }
    
    /**
     * Logs cache operations
     */
    public void cacheOperation(String operation, String key, boolean hit) {
        logger.debug("CACHE_{}: {} - Key: {} - Hit: {}", operation.toUpperCase(), key, hit);
    }
    
    /**
     * Logs application startup
     */
    public void applicationStartup(String version, String profile) {
        logger.info("APPLICATION_STARTUP: WebFingerprint v{} started with profile: {}", version, profile);
    }
    
    /**
     * Logs application shutdown
     */
    public void applicationShutdown(String reason) {
        logger.info("APPLICATION_SHUTDOWN: WebFingerprint shutting down - Reason: {}", reason);
    }
    
    /**
     * Logs configuration changes
     */
    public void configurationChange(String property, String oldValue, String newValue) {
        logger.info("CONFIG_CHANGE: {} changed from '{}' to '{}'", property, oldValue, newValue);
    }
    
    /**
     * Logs health check results
     */
    public void healthCheck(String component, String status, String details) {
        if ("UP".equals(status)) {
            logger.debug("HEALTH_CHECK: {} - Status: {} - {}", component, status, details);
        } else {
            logger.warn("HEALTH_CHECK: {} - Status: {} - {}", component, status, details);
        }
    }
    
    /**
     * Generates a correlation ID for request tracing
     */
    public String generateCorrelationId() {
        return UUID.randomUUID().toString();
    }
    
    /**
     * Sets correlation ID in MDC for request tracing
     */
    public void setCorrelationId(String correlationId) {
        MDC.put("correlationId", correlationId);
    }
    
    /**
     * Clears correlation ID from MDC
     */
    public void clearCorrelationId() {
        MDC.remove("correlationId");
    }
    
    /**
     * Logs with structured context
     */
    public void logWithContext(String level, String message, Map<String, String> context) {
        try {
            context.forEach(MDC::put);
            switch (level.toUpperCase()) {
                case "DEBUG":
                    logger.debug(message);
                    break;
                case "INFO":
                    logger.info(message);
                    break;
                case "WARN":
                    logger.warn(message);
                    break;
                case "ERROR":
                    logger.error(message);
                    break;
                default:
                    logger.info(message);
            }
        } finally {
            context.keySet().forEach(MDC::remove);
        }
    }
}
