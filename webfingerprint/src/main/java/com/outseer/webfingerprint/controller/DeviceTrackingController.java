package com.outseer.webfingerprint.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.outseer.webfingerprint.dto.DeviceFingerprintRequest;
import com.outseer.webfingerprint.dto.DeviceTrackingResponse;
import com.outseer.webfingerprint.model.Device;
import com.outseer.webfingerprint.service.DeviceTrackingService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/device")
public class DeviceTrackingController {

    private final DeviceTrackingService deviceTrackingService;

    public DeviceTrackingController(DeviceTrackingService service) {
        this.deviceTrackingService = service;
    }

    /**
     * Retrieves device statistics by device ID.
     * @param id Device fingerprint hash
     * @return ResponseEntity with DeviceTrackingResponse and HTTP status
     */
    @GetMapping("/{id}")
    public ResponseEntity<DeviceTrackingResponse> getStats(@PathVariable String id) {
        try {
            DeviceTrackingResponse stats = deviceTrackingService.getDeviceStats(id);
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            System.err.println("Error getting stats: " + e.getMessage());
            DeviceTrackingResponse response = new DeviceTrackingResponse();
            response.setStatus("fail");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Tracks a device by fingerprint and returns tracking info.
     * @param fingerprint DeviceFingerprintRequest from client
     * @return ResponseEntity with DeviceTrackingResponse and HTTP status
     */
    @PostMapping
    public ResponseEntity<DeviceTrackingResponse> trackDevice(@RequestBody DeviceFingerprintRequest fingerprint) {
        try {
            DeviceTrackingResponse response = deviceTrackingService.creteDeviceInfo(fingerprint);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("Error tracking device: " + e.getMessage());
            DeviceTrackingResponse errorResponse = new DeviceTrackingResponse("error_" + System.currentTimeMillis(), 0L, true, "Error processing device fingerprint",0,"fail");
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }
}
