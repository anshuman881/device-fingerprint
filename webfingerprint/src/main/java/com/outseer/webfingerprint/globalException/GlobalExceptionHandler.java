package com.outseer.webfingerprint.globalException;

import com.outseer.webfingerprint.dto.DeviceTrackingResponse;
import com.outseer.webfingerprint.exception.DeviceNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDateTime;

@ControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(DeviceNotFoundException.class)
    public ResponseEntity<DeviceTrackingResponse> handleDeviceNotFoundException(DeviceNotFoundException ex) {
        logger.warn("Device not found: {}", ex.getMessage());
        DeviceTrackingResponse response = new DeviceTrackingResponse();
        response.setStatus("not_found");
        response.setMessage(ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<DeviceTrackingResponse> handleGeneralException(Exception ex) {
        logger.error("An unexpected error occurred: {}", ex.getMessage(), ex);
        DeviceTrackingResponse errorResponse = new DeviceTrackingResponse(
                "error_" + System.currentTimeMillis(),
                0L,
                "An unexpected error occurred: " + ex.getMessage(),
                0,
                "Fail",
                LocalDateTime.now(),
                LocalDateTime.now()
        );
        return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
