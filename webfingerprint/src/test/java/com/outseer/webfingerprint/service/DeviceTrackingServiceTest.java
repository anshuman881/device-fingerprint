package com.outseer.webfingerprint.service;

import com.outseer.webfingerprint.dto.DeviceFingerprintRequest;
import com.outseer.webfingerprint.dto.DeviceTrackingResponse;
import com.outseer.webfingerprint.exception.DeviceNotFoundException;
import com.outseer.webfingerprint.model.Device;
import com.outseer.webfingerprint.repository.DeviceRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DeviceTrackingServiceTest {

    @Mock
    private DeviceRepository deviceRepository;

    @InjectMocks
    private DeviceTrackingService deviceTrackingService;

    private DeviceFingerprintRequest request;
    private Device device;

    @BeforeEach
    void setUp() {
        request = new DeviceFingerprintRequest();
        request.setHash("testHash");
        request.setUserAgent("testAgent");
        request.setPlatform("testPlatform");
        request.setScreenResolution("1920x1080");
        request.setTimezone("UTC");
        request.setLanguage("en");

        device = new Device(
            request.getHash(),
            request.getUserAgent(),
            request.getScreenResolution(),
            request.getTimezone(),
            request.getLanguage(),
            request.getPlatform()
        );
        device.setFirstSeen(LocalDateTime.now());
        device.setVisitCount(1);
    }

    @Test
    void createDeviceInfo_ShouldCreateNewDevice() {
        when(deviceRepository.save(any(Device.class))).thenReturn(device);

        DeviceTrackingResponse response = deviceTrackingService.createDeviceInfo(request);

        assertNotNull(response);
        assertEquals(device.getDeviceId(), response.getDeviceId());
        assertEquals("success", response.getStatus());
        verify(deviceRepository).save(any(Device.class));
    }

    @Test
    void getDeviceStats_ShouldReturnDeviceStats_WhenDeviceExists() {
        when(deviceRepository.findById(anyString())).thenReturn(Optional.of(device));
        when(deviceRepository.save(any(Device.class))).thenReturn(device);

        DeviceTrackingResponse response = deviceTrackingService.getDeviceStats("testHash");

        assertNotNull(response);
        assertEquals(device.getDeviceId(), response.getDeviceId());
        assertEquals("success", response.getStatus());
        verify(deviceRepository).findById("testHash");
        verify(deviceRepository).save(any(Device.class));
    }

    @Test
    void getDeviceStats_ShouldThrowException_WhenDeviceNotFound() {
        when(deviceRepository.findById(anyString())).thenReturn(Optional.empty());

        assertThrows(DeviceNotFoundException.class, () -> 
            deviceTrackingService.getDeviceStats("nonexistentHash")
        );

        verify(deviceRepository).findById("nonexistentHash");
        verify(deviceRepository, never()).save(any(Device.class));
    }

    @Test
    void saveDevice_ShouldIncrementVisitCount() {
        when(deviceRepository.save(any(Device.class))).thenReturn(device);

        deviceTrackingService.saveDevice(device);

        assertEquals(2, device.getVisitCount());
        verify(deviceRepository).save(device);
    }
}