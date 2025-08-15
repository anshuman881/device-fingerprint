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

    public DeviceTrackingService(DeviceRepository deviceRepository) {
        this.deviceRepository = deviceRepository;
    }

    /**
     * Creates a new device entry or updates an existing one from the fingerprint request and returns tracking info.
     * This method will also update the cache after saving the device.
     * @param request Device fingerprint data from client
     * @return DeviceTrackingResponse with visit count and a relevant message
     */
    @CachePut(value = "devices", key = "#request.hash")
    public DeviceTrackingResponse createOrUpdateDeviceInfo(DeviceFingerprintRequest request) {
        Optional<Device> existingDevice = deviceRepository.findById(request.getHash());

        Device deviceToSave;
        if (existingDevice.isPresent()) {
            deviceToSave = existingDevice.get();
            deviceToSave.setVisitCount(deviceToSave.getVisitCount() + 1);
            deviceToSave.setLastSeen(LocalDateTime.now());
        } else {
            deviceToSave = new Device(request.getHash(), request.getUserAgent(), request.getScreenResolution(), request.getTimezone()
                    , request.getLanguage(), request.getPlatform());
            deviceToSave.setVisitCount(1);
            deviceToSave.setFirstSeen(LocalDateTime.now());
            deviceToSave.setLastSeen(LocalDateTime.now());
        }
        deviceRepository.save(deviceToSave);
        return createDeviceTrackingResponse(deviceToSave, "success");
    }

    /**
     * Retrieves device statistics by device ID and updates visit count.
     * @param id Device fingerprint hash
     * @return DeviceTrackingResponse with updated stats
     */
    public DeviceTrackingResponse getDeviceStats(String id) {
        Optional<Device> deviceOptional = findDeviceById(id);
        if (deviceOptional.isPresent()) {
            Device existingDevice = deviceOptional.get();
            existingDevice.setVisitCount(existingDevice.getVisitCount() + 1);
            existingDevice.setLastSeen(LocalDateTime.now());
            deviceRepository.save(existingDevice);
            return createDeviceTrackingResponse(existingDevice, "success");
        } else {
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
        return deviceRepository.findById(id);
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
