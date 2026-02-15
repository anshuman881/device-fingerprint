package com.outseer.webfingerprint.controller;

import com.outseer.webfingerprint.dto.DeviceFingerprintRequest;
import com.outseer.webfingerprint.dto.DeviceTrackingResponse;
import com.outseer.webfingerprint.service.DeviceTrackingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import jakarta.validation.Valid;

@RestController
@RequestMapping("api/device")
@Tag(name = "Device Tracking", description = "Device fingerprint tracking API endpoints")
public class DeviceTrackingController {

    private static final Logger logger = LoggerFactory.getLogger(DeviceTrackingController.class);
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
        DeviceTrackingResponse stats = deviceTrackingService.getDeviceStats(id);
        return ResponseEntity.ok(stats);
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
    public ResponseEntity<DeviceTrackingResponse> trackDevice(@Valid @RequestBody DeviceFingerprintRequest fingerprint) {
        DeviceTrackingResponse response = deviceTrackingService.createOrUpdateDeviceInfo(fingerprint);
        return ResponseEntity.ok(response);
    }
}
