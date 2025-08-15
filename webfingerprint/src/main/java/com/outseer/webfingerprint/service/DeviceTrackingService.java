package com.outseer.webfingerprint.service;


import com.outseer.webfingerprint.dto.DeviceFingerprintRequest;
import com.outseer.webfingerprint.dto.DeviceTrackingResponse;
import com.outseer.webfingerprint.exception.DeviceNotFoundException;
import com.outseer.webfingerprint.model.Device;
import com.outseer.webfingerprint.repository.DeviceRepository;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class DeviceTrackingService {

    private final DeviceRepository deviceRepository;

    public DeviceTrackingService(DeviceRepository deviceRepository) {
        this.deviceRepository = deviceRepository;
    }

    /**
     * Creates a new device entry from the fingerprint request and returns tracking info.
     * @param request Device fingerprint data from client
     * @return DeviceTrackingResponse with visit count and welcome message
     */
    public DeviceTrackingResponse createDeviceInfo(DeviceFingerprintRequest request) {
        Device device = new Device(request.getHash(), request.getUserAgent(), request.getScreenResolution(), request.getTimezone()
                , request.getLanguage(), request.getPlatform());
        deviceRepository.save(device);
        DeviceTrackingResponse response = createDeviceTrackingResponse(device, "success");
        response.setVisitCount(device.getVisitCount());
        response.setMessage("Welcome back! Visit #" + device.getVisitCount());
        return response;
    }

    /**
     * Retrieves device statistics by device ID and updates visit count.
     * @param id Device fingerprint hash
     * @return DeviceTrackingResponse with updated stats
     */
    public DeviceTrackingResponse getDeviceStats(String id) {
        Optional<Device> device = deviceRepository.findById(id);
        if (device.isPresent()) {
            saveDevice(device.get());
            return createDeviceTrackingResponse(device.get(), "success");
        } else {
            throw new DeviceNotFoundException("Device Not Found");
        }
    }

    /**
     * Increments the visit count for a device and saves it.
     * @param device Device entity to update
     */
    public void saveDevice(Device device) {
        device.setVisitCount(device.getVisitCount() + 1);
        device.setLastSeen(LocalDateTime.now());
        deviceRepository.save(device);
    }

    /**
     * Builds a DeviceTrackingResponse from a Device entity.
     * @param device Device entity
     * @param status Status string for response
     * @return DeviceTrackingResponse with device info and stats
     */
    public DeviceTrackingResponse createDeviceTrackingResponse(Device device, String status) {
        return new DeviceTrackingResponse(
                device.getDeviceId(),
                Duration.between(device.getFirstSeen(), LocalDateTime.now()).toMinutes(),
                "Welcome! This is your " + device.getVisitCount() + " visit.",
                device.getVisitCount(),
                status,
                device.getFirstSeen(),
                device.getLastSeen()
        );
    }
}
