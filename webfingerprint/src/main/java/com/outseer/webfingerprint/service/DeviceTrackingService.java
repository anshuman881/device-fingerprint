package com.outseer.webfingerprint.service;


import com.outseer.webfingerprint.dto.DeviceFingerprintRequest;
import com.outseer.webfingerprint.dto.DeviceTrackingResponse;
import com.outseer.webfingerprint.exception.DeviceNotFoundException;
import com.outseer.webfingerprint.model.Device;
import com.outseer.webfingerprint.repository.DeviceRepository;
import org.springframework.stereotype.Service;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class DeviceTrackingService {

    private final DeviceRepository deviceRepository;
    private final LoggingService loggingService;

    public DeviceTrackingService(DeviceRepository deviceRepository, LoggingService loggingService) {
        this.deviceRepository = deviceRepository;
        this.loggingService = loggingService;
    }

    /**
     * Creates a new device entry or updates an existing one from the fingerprint request and returns tracking info.
     * This method will also update the cache after saving the device.
     * @param request Device fingerprint data from client
     * @return DeviceTrackingResponse with visit count and a relevant message
     */
    @CachePut(value = "devices", key = "#request.hash")
    public DeviceTrackingResponse createOrUpdateDeviceInfo(DeviceFingerprintRequest request) {
        long startTime = System.currentTimeMillis();
        loggingService.debug("Processing device tracking request for hash: {}", request.getHash());
        
        Optional<Device> existingDevice = deviceRepository.findById(request.getHash());

        Device deviceToSave;
        if (existingDevice.isPresent()) {
            deviceToSave = existingDevice.get();
            deviceToSave.setVisitCount(deviceToSave.getVisitCount() + 1);
            deviceToSave.setLastSeen(LocalDateTime.now());
            loggingService.deviceTracked(request.getHash(), request.getUserAgent(), deviceToSave.getVisitCount());
        } else {
            deviceToSave = new Device(request.getHash(), request.getUserAgent(), request.getScreenResolution(), request.getTimezone()
                    , request.getLanguage(), request.getPlatform());
            deviceToSave.setVisitCount(1);
            deviceToSave.setFirstSeen(LocalDateTime.now());
            deviceToSave.setLastSeen(LocalDateTime.now());
            loggingService.newDeviceRegistered(request.getHash(), request.getUserAgent());
        }
        
        long dbStartTime = System.currentTimeMillis();
        deviceRepository.save(deviceToSave);
        long dbDuration = System.currentTimeMillis() - dbStartTime;
        loggingService.databaseOperation("SAVE", "Device", dbDuration);
        
        long totalDuration = System.currentTimeMillis() - startTime;
        loggingService.performanceMetric("CREATE_OR_UPDATE_DEVICE", totalDuration, 
            String.format("Device: %s, VisitCount: %d", request.getHash(), deviceToSave.getVisitCount()));
        
        return createDeviceTrackingResponse(deviceToSave, "success");
    }

    /**
     * Retrieves device statistics by device ID and updates visit count.
     * @param id Device fingerprint hash
     * @return DeviceTrackingResponse with updated stats
     */
    public DeviceTrackingResponse getDeviceStats(String id) {
        long startTime = System.currentTimeMillis();
        loggingService.debug("Retrieving device stats for hash: {}", id);
        
        Optional<Device> deviceOptional = findDeviceById(id);
        if (deviceOptional.isPresent()) {
            Device existingDevice = deviceOptional.get();
            existingDevice.setVisitCount(existingDevice.getVisitCount() + 1);
            existingDevice.setLastSeen(LocalDateTime.now());
            
            long dbStartTime = System.currentTimeMillis();
            deviceRepository.save(existingDevice);
            long dbDuration = System.currentTimeMillis() - dbStartTime;
            loggingService.databaseOperation("UPDATE", "Device", dbDuration);
            
            loggingService.deviceTracked(id, existingDevice.getUserAgent(), existingDevice.getVisitCount());
            
            long totalDuration = System.currentTimeMillis() - startTime;
            loggingService.performanceMetric("GET_DEVICE_STATS", totalDuration, 
                String.format("Device: %s, VisitCount: %d", id, existingDevice.getVisitCount()));
            
            return createDeviceTrackingResponse(existingDevice, "success");
        } else {
            loggingService.warn("Device not found for hash: {}", id);
            throw new DeviceNotFoundException("Device Not Found");
        }
    }

    /**
     * Fetches a device by its ID from the repository, with caching.
     * @param id Device fingerprint hash
     * @return Optional containing the Device if found, otherwise empty.
     */
    @Cacheable(value = "devices", key = "#id")
    protected Optional<Device> findDeviceById(String id) {
        long startTime = System.currentTimeMillis();
        Optional<Device> device = deviceRepository.findById(id);
        long duration = System.currentTimeMillis() - startTime;
        
        if (device.isPresent()) {
            loggingService.cacheOperation("GET", id, true);
            loggingService.databaseOperation("FIND", "Device", duration);
        } else {
            loggingService.cacheOperation("GET", id, false);
            loggingService.databaseOperation("FIND", "Device", duration);
        }
        
        return device;
    }

    /**
     * Builds a DeviceTrackingResponse from a Device entity.
     * @param device Device entity
     * @param status Status string for response
     * @return DeviceTrackingResponse with device info and stats
     */
    public DeviceTrackingResponse createDeviceTrackingResponse(Device device, String status) {
        String message;
        if (device.getVisitCount() == 1) {
            message = "Welcome! This is your first visit.";
        } else {
            message = "Welcome back! This is your " + device.getVisitCount() + " visit.";
        }
        return new DeviceTrackingResponse(
                device.getDeviceId(),
                Duration.between(device.getFirstSeen(), LocalDateTime.now()).toMinutes(),
                message,
                device.getVisitCount(),
                status,
                device.getFirstSeen(),
                device.getLastSeen()
        );
    }
}
