package com.outseer.webfingerprint.globalException;

import com.outseer.webfingerprint.dto.DeviceTrackingResponse;
import com.outseer.webfingerprint.exception.DeviceNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;

import java.sql.Timestamp;
import java.time.LocalDateTime;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(DeviceNotFoundException.class)
    public ResponseEntity<DeviceTrackingResponse> handleDeviceNotFoundException(
            DeviceNotFoundException ex,
            WebRequest request) {

        DeviceTrackingResponse errorResponse = new DeviceTrackingResponse(
                "unknown",0L,"Device not found",0,"Fail", LocalDateTime.now(),LocalDateTime.now()
        );

        return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<DeviceTrackingResponse> handleGlobalException(
            Exception ex,
            WebRequest request) {

        DeviceTrackingResponse errorResponse = new DeviceTrackingResponse(
                "error",0L,"An unexpected error occurred",0,"Error", LocalDateTime.now(),LocalDateTime.now()
        );

        return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<DeviceTrackingResponse> handleIllegalArgumentException(
            IllegalArgumentException ex,
            WebRequest request) {

        DeviceTrackingResponse errorResponse = new DeviceTrackingResponse(
                "invalid",0L,ex.getMessage(),0,"Error", LocalDateTime.now(),LocalDateTime.now()
        );

        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
    }
}
