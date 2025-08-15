package com.outseer.webfingerprint.controller;

import com.outseer.webfingerprint.dto.DeviceFingerprintRequest;
import com.outseer.webfingerprint.dto.DeviceTrackingResponse;
import com.outseer.webfingerprint.exception.DeviceNotFoundException;
import com.outseer.webfingerprint.service.DeviceTrackingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("api/device")
@Tag(name = "Device Tracking", description = "Device fingerprint tracking API endpoints")
public class DeviceTrackingController {

    private final DeviceTrackingService deviceTrackingService;

    public DeviceTrackingController(DeviceTrackingService service) {
        this.deviceTrackingService = service;
    }

    /**
     * Retrieves device statistics by device ID.
     *
     * @param id Device fingerprint hash
     * @return ResponseEntity with DeviceTrackingResponse and HTTP status
     */
    @Operation(summary = "Get device statistics",
            description = "Retrieves tracking information for a device by its fingerprint hash")
    @ApiResponse(responseCode = "200", description = "Device stats retrieved successfully",
            content = @Content(schema = @Schema(implementation = DeviceTrackingResponse.class)))
    @ApiResponse(responseCode = "404", description = "Device not found")
    @GetMapping("/{id}")
    public ResponseEntity<DeviceTrackingResponse> getStats(@PathVariable String id) {
        try {
            DeviceTrackingResponse stats = deviceTrackingService.getDeviceStats(id);
            return ResponseEntity.ok(stats);
        } catch (DeviceNotFoundException e) {
            DeviceTrackingResponse response = new DeviceTrackingResponse();
            response.setStatus("not_found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        } catch (Exception e) {
            DeviceTrackingResponse response = new DeviceTrackingResponse();
            response.setStatus("fail");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Tracks a device by fingerprint and returns tracking info.
     *
     * @param fingerprint DeviceFingerprintRequest from client
     * @return ResponseEntity with DeviceTrackingResponse and HTTP status
     */
    @Operation(summary = "Track device",
            description = "Register or update device tracking information")
    @ApiResponse(responseCode = "200", description = "Device tracked successfully",
            content = @Content(schema = @Schema(implementation = DeviceTrackingResponse.class)))
    @PostMapping
    public ResponseEntity<DeviceTrackingResponse> trackDevice(@RequestBody DeviceFingerprintRequest fingerprint) {
        try {
            DeviceTrackingResponse response = deviceTrackingService.createDeviceInfo(fingerprint);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            try {
                DeviceTrackingResponse stats = deviceTrackingService.getDeviceStats(fingerprint.getHash());
                return ResponseEntity.ok(stats);
            } catch (Exception ex) {
                System.err.println("Error tracking device: " + e.getMessage());
                DeviceTrackingResponse errorResponse = new DeviceTrackingResponse("error_" + System.currentTimeMillis(), 0L,"Error processing device fingerprint",0,"Fail", LocalDateTime.now(),LocalDateTime.now());
                return ResponseEntity.internalServerError().body(errorResponse);
            }
        }
    }
}
