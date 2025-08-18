package com.outseer.webfingerprint.aspect;

import com.outseer.webfingerprint.annotation.LogExecutionTime;
import com.outseer.webfingerprint.service.LoggingService;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.stereotype.Component;

import java.lang.reflect.Method;

/**
 * Aspect for logging method execution time using the @LogExecutionTime annotation.
 */
@Aspect
@Component
public class LogExecutionTimeAspect {

    private final LoggingService loggingService;

    public LogExecutionTimeAspect(LoggingService loggingService) {
        this.loggingService = loggingService;
    }

    @Around("@annotation(com.outseer.webfingerprint.annotation.LogExecutionTime)")
    public Object logExecutionTime(ProceedingJoinPoint joinPoint) throws Throwable {
        long startTime = System.currentTimeMillis();
        
        MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        Method method = signature.getMethod();
        LogExecutionTime annotation = method.getAnnotation(LogExecutionTime.class);
        
        String methodName = method.getName();
        String className = method.getDeclaringClass().getSimpleName();
        String operationName = annotation.value().isEmpty() ? 
            className + "." + methodName : annotation.value();
        
        // Log method entry with parameters if enabled
        if (annotation.logParameters()) {
            Object[] args = joinPoint.getArgs();
            String[] paramNames = signature.getParameterNames();
            StringBuilder params = new StringBuilder();
            for (int i = 0; i < args.length; i++) {
                if (i > 0) params.append(", ");
                params.append(paramNames[i]).append("=").append(args[i]);
            }
            loggingService.debug("Starting execution of {} with parameters: {}", operationName, params.toString());
        } else {
            loggingService.debug("Starting execution of {}", operationName);
        }
        
        Object result = null;
        try {
            result = joinPoint.proceed();
            return result;
        } finally {
            long duration = System.currentTimeMillis() - startTime;
            
            // Log execution time
            loggingService.performanceMetric(operationName, duration, 
                String.format("Method: %s.%s", className, methodName));
            
            // Check for slow operation
            if (duration > annotation.slowThreshold()) {
                loggingService.slowOperation(operationName, duration, annotation.slowThreshold());
            }
            
            // Log return value if enabled
            if (annotation.logReturnValue() && result != null) {
                loggingService.debug("Completed execution of {} in {}ms, returned: {}", 
                    operationName, duration, result);
            } else {
                loggingService.debug("Completed execution of {} in {}ms", operationName, duration);
            }
        }
    }
}
