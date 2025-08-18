# WebFingerprint Logging System

This document describes the comprehensive logging system implemented for the WebFingerprint application.

## Overview

The logging system provides structured logging with multiple levels, specialized loggers for different concerns, and automatic request/response logging with correlation IDs.

## Features

### 1. Multiple Log Levels
- **Console Logging**: Human-readable logs for development
- **File Logging**: Persistent logs with rotation
- **JSON Logging**: Structured logs for log aggregation systems
- **Specialized Logs**: Security, performance, and error logs

### 2. Specialized Loggers
- **Security Logger**: Authentication events, security incidents
- **Performance Logger**: Method execution times, slow operations
- **Business Logger**: Business events, device tracking
- **Error Logger**: All error-level logs in separate file

### 3. Request/Response Logging
- Automatic correlation ID generation
- Request/response timing
- Client IP detection
- User agent logging
- Slow operation detection

### 4. Performance Monitoring
- Method execution time tracking
- Database operation timing
- Cache hit/miss logging
- Custom performance annotations

## Configuration

### Logback Configuration (`logback-spring.xml`)

The application uses Logback with the following appenders:

- **CONSOLE**: Human-readable console output
- **FILE**: Rotating file logs (10MB max, 30 days retention)
- **JSON_FILE**: Structured JSON logs for log aggregation
- **ERROR_FILE**: Error-only logs
- **SECURITY_FILE**: Security-related logs
- **PERFORMANCE_FILE**: Performance metrics

### Application Properties

```properties
# Logging levels
logging.level.com.outseer.webfingerprint=INFO
logging.level.com.outseer.webfingerprint.controller=DEBUG
logging.level.com.outseer.webfingerprint.service=DEBUG
logging.level.com.outseer.webfingerprint.security=INFO
logging.level.com.outseer.webfingerprint.performance=INFO

# Log file paths
logging.file.path=./logs
logging.file.name=./logs/webfingerprint.log
```

## Usage

### 1. Using LoggingService

```java
@Service
public class MyService {
    private final LoggingService loggingService;
    
    public MyService(LoggingService loggingService) {
        this.loggingService = loggingService;
    }
    
    public void someMethod() {
        // Basic logging
        loggingService.info("Processing request");
        loggingService.debug("Debug information");
        loggingService.warn("Warning message");
        loggingService.error("Error occurred", exception);
        
        // Business events
        loggingService.businessEvent("USER_REGISTERED", "New user registered");
        
        // Performance metrics
        loggingService.performanceMetric("DATABASE_QUERY", 150, "User lookup");
        
        // Security events
        loggingService.securityEvent("LOGIN_ATTEMPT", "User login attempt");
    }
}
```

### 2. Using @LogExecutionTime Annotation

```java
@Service
public class MyService {
    
    @LogExecutionTime(value = "User Lookup", slowThreshold = 500)
    public User findUser(String userId) {
        // Method implementation
        return userRepository.findById(userId);
    }
    
    @LogExecutionTime(value = "Complex Operation", logParameters = true, logReturnValue = true)
    public Result complexOperation(String param1, int param2) {
        // Method implementation
        return result;
    }
}
```

### 3. Automatic Request/Response Logging

All controller methods are automatically logged with:
- Request method and path
- Response status and timing
- Correlation ID for request tracing
- Client IP and user agent

## Log Files

The application creates the following log files in the `./logs` directory:

- `webfingerprint.log`: General application logs
- `webfingerprint-json.log`: Structured JSON logs
- `error.log`: Error-level logs only
- `security.log`: Security-related events
- `performance.log`: Performance metrics
- `archive/`: Rotated log files

## Log Rotation

Logs are automatically rotated when they reach 10MB and kept for 30 days. Archive files are stored in `./logs/archive/` with the pattern:
- `webfingerprint.YYYY-MM-DD.N.log`
- `webfingerprint-json.YYYY-MM-DD.N.log`
- etc.

## Correlation IDs

Each HTTP request gets a unique correlation ID that is:
- Generated automatically
- Added to MDC (Mapped Diagnostic Context)
- Included in all log entries for that request
- Used for request tracing across the application

## Performance Monitoring

### Automatic Monitoring
- All controller methods are automatically timed
- Database operations are logged with timing
- Cache operations are logged (hit/miss)
- Slow operations (>1s) trigger warnings

### Custom Monitoring
Use the `@LogExecutionTime` annotation to monitor specific methods:

```java
@LogExecutionTime(value = "Custom Operation", slowThreshold = 2000)
public void customMethod() {
    // Method implementation
}
```

## Security Logging

Security events are automatically logged to the security log file:

- Authentication attempts (success/failure)
- Authorization failures
- Security-related exceptions
- Suspicious activities

## Business Event Logging

Business events are logged with context:

```java
loggingService.deviceTracked(deviceHash, userAgent, visitCount);
loggingService.newDeviceRegistered(deviceHash, userAgent);
```

## Environment-Specific Configuration

### Development
- DEBUG level logging for detailed information
- Console and file logging enabled
- SQL query logging enabled

### Production
- WARN level logging for reduced noise
- File and JSON logging only
- Performance monitoring enabled
- Error tracking enabled

## Monitoring and Alerting

### Metrics Available
- Request/response times
- Error rates
- Database performance
- Cache hit rates
- Security events

### Integration
- Prometheus metrics available at `/actuator/prometheus`
- Health checks at `/actuator/health`
- Application info at `/actuator/info`

## Best Practices

1. **Use appropriate log levels**:
   - ERROR: For errors that need immediate attention
   - WARN: For potentially harmful situations
   - INFO: For general application flow
   - DEBUG: For detailed debugging information

2. **Include context in logs**:
   - Use structured logging with MDC
   - Include correlation IDs
   - Add relevant business context

3. **Performance considerations**:
   - Use `@LogExecutionTime` for expensive operations
   - Avoid logging sensitive data
   - Use appropriate log levels in production

4. **Security logging**:
   - Log all authentication attempts
   - Monitor for suspicious patterns
   - Use dedicated security log file

## Troubleshooting

### Common Issues

1. **Log files not created**: Check file permissions and directory existence
2. **High disk usage**: Adjust log rotation settings
3. **Performance impact**: Reduce log levels in production
4. **Missing correlation IDs**: Ensure MDC is properly configured

### Debug Commands

```bash
# Check log files
tail -f ./logs/webfingerprint.log

# Monitor errors
tail -f ./logs/error.log

# Check security events
tail -f ./logs/security.log

# Monitor performance
tail -f ./logs/performance.log
```

## Future Enhancements

- Integration with ELK stack (Elasticsearch, Logstash, Kibana)
- Real-time log streaming
- Advanced alerting rules
- Log analytics dashboard
- Custom log formatters
