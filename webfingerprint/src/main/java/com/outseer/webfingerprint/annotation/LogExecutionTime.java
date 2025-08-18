package com.outseer.webfingerprint.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * Custom annotation to log method execution time.
 * Can be used on methods to automatically log performance metrics.
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface LogExecutionTime {
    
    /**
     * Optional description for the operation being logged
     */
    String value() default "";
    
    /**
     * Threshold in milliseconds to trigger a slow operation warning
     */
    long slowThreshold() default 1000L;
    
    /**
     * Whether to log the method parameters
     */
    boolean logParameters() default false;
    
    /**
     * Whether to log the return value
     */
    boolean logReturnValue() default false;
}
