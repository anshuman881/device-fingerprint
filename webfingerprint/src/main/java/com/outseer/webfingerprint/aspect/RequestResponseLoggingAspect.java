package com.outseer.webfingerprint.aspect;

import com.outseer.webfingerprint.service.LoggingService;
import jakarta.servlet.http.HttpServletRequest;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.slf4j.MDC;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.util.UUID;

/**
 * Aspect for logging HTTP requests and responses with performance metrics.
 * Automatically adds correlation IDs and logs request/response details.
 */
@Aspect
@Component
public class RequestResponseLoggingAspect {

    private final LoggingService loggingService;

    public RequestResponseLoggingAspect(LoggingService loggingService) {
        this.loggingService = loggingService;
    }

    /**
     * Intercepts all controller methods to log requests and responses
     */
    @Around("@annotation(org.springframework.web.bind.annotation.RequestMapping) || " +
            "@annotation(org.springframework.web.bind.annotation.GetMapping) || " +
            "@annotation(org.springframework.web.bind.annotation.PostMapping) || " +
            "@annotation(org.springframework.web.bind.annotation.PutMapping) || " +
            "@annotation(org.springframework.web.bind.annotation.DeleteMapping) || " +
            "@annotation(org.springframework.web.bind.annotation.PatchMapping)")
    public Object logRequestResponse(ProceedingJoinPoint joinPoint) throws Throwable {
        long startTime = System.currentTimeMillis();
        String correlationId = generateCorrelationId();
        
        try {
            // Set correlation ID in MDC for the entire request
            MDC.put("correlationId", correlationId);
            
            // Log request details
            logRequest(joinPoint, correlationId);
            
            // Execute the method
            Object result = joinPoint.proceed();
            
            // Log response details
            long duration = System.currentTimeMillis() - startTime;
            logResponse(joinPoint, result, duration, correlationId, 200);
            
            return result;
            
        } catch (Exception e) {
            // Log error response
            long duration = System.currentTimeMillis() - startTime;
            logResponse(joinPoint, null, duration, correlationId, 500);
            throw e;
        } finally {
            // Clean up MDC
            MDC.remove("correlationId");
        }
    }

    /**
     * Logs request details
     */
    private void logRequest(ProceedingJoinPoint joinPoint, String correlationId) {
        try {
            ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
            if (attributes != null) {
                HttpServletRequest request = attributes.getRequest();
                String method = request.getMethod();
                String path = request.getRequestURI();
                String queryString = request.getQueryString();
                String fullPath = queryString != null ? path + "?" + queryString : path;
                String userAgent = request.getHeader("User-Agent");
                String clientIp = getClientIpAddress(request);
                
                loggingService.apiRequest(method, fullPath, correlationId);
                
                loggingService.debug("Request details - Method: {}, Path: {}, User-Agent: {}, Client-IP: {}, CorrelationId: {}", 
                    method, fullPath, userAgent, clientIp, correlationId);
            }
        } catch (Exception e) {
            loggingService.error("Error logging request", e);
        }
    }

    /**
     * Logs response details
     */
    private void logResponse(ProceedingJoinPoint joinPoint, Object result, long duration, String correlationId, int statusCode) {
        try {
            ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
            if (attributes != null) {
                HttpServletRequest request = attributes.getRequest();
                String method = request.getMethod();
                String path = request.getRequestURI();
                String queryString = request.getQueryString();
                String fullPath = queryString != null ? path + "?" + queryString : path;
                
                loggingService.apiResponse(method, fullPath, statusCode, duration, correlationId);
                
                // Log slow operations
                if (duration > 1000) { // 1 second threshold
                    loggingService.slowOperation(joinPoint.getSignature().getName(), duration, 1000);
                }
                
                loggingService.debug("Response details - Method: {}, Path: {}, Status: {}, Duration: {}ms, CorrelationId: {}", 
                    method, fullPath, statusCode, duration, correlationId);
            }
        } catch (Exception e) {
            loggingService.error("Error logging response", e);
        }
    }

    /**
     * Gets the client IP address from the request
     */
    private String getClientIpAddress(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty() && !"unknown".equalsIgnoreCase(xForwardedFor)) {
            return xForwardedFor.split(",")[0].trim();
        }
        
        String xRealIp = request.getHeader("X-Real-IP");
        if (xRealIp != null && !xRealIp.isEmpty() && !"unknown".equalsIgnoreCase(xRealIp)) {
            return xRealIp;
        }
        
        return request.getRemoteAddr();
    }

    /**
     * Generates a correlation ID for request tracing
     */
    private String generateCorrelationId() {
        return UUID.randomUUID().toString();
    }
}
