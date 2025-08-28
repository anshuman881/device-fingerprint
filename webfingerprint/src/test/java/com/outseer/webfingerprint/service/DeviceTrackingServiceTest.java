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
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyBoolean;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DeviceTrackingServiceTest {

    @Mock
    private DeviceRepository deviceRepository;
    
    @Mock
    private LoggingService loggingService;

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
    void createOrUpdateDeviceInfo_ShouldCreateNewDevice() {
        when(deviceRepository.save(any(Device.class))).thenReturn(device);
        // Mock logging service calls
        doNothing().when(loggingService).debug(anyString(), any(Object[].class));
        doNothing().when(loggingService).newDeviceRegistered(anyString(), anyString());
        doNothing().when(loggingService).databaseOperation(anyString(), anyString(), anyLong());
        doNothing().when(loggingService).performanceMetric(anyString(), anyLong(), anyString());

        DeviceTrackingResponse response = deviceTrackingService.createOrUpdateDeviceInfo(request);

        assertNotNull(response);
        assertEquals(device.getDeviceId(), response.getDeviceId());
        assertEquals("success", response.getStatus());
        verify(deviceRepository).save(any(Device.class));
        verify(loggingService).debug(anyString(), any(Object[].class));
        verify(loggingService).newDeviceRegistered(anyString(), anyString());
        verify(loggingService).databaseOperation(anyString(), anyString(), anyLong());
        verify(loggingService).performanceMetric(anyString(), anyLong(), anyString());
    }

    @Test
    void getDeviceStats_ShouldReturnDeviceStats_WhenDeviceExists() {
        when(deviceRepository.findById(anyString())).thenReturn(Optional.of(device));
        when(deviceRepository.save(any(Device.class))).thenReturn(device);
        // Mock logging service calls
        doNothing().when(loggingService).debug(anyString(), any(Object[].class));
        doNothing().when(loggingService).deviceTracked(anyString(), anyString(), anyInt());
        doNothing().when(loggingService).databaseOperation(anyString(), anyString(), anyLong());
        doNothing().when(loggingService).performanceMetric(anyString(), anyLong(), anyString());
        doNothing().when(loggingService).cacheOperation(anyString(), anyString(), anyBoolean());

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
        // Mock logging service calls
        doNothing().when(loggingService).debug(anyString(), any(Object[].class));
        doNothing().when(loggingService).warn(anyString(), any(Object[].class));
        doNothing().when(loggingService).cacheOperation(anyString(), anyString(), anyBoolean());
        doNothing().when(loggingService).databaseOperation(anyString(), anyString(), anyLong());

        assertThrows(DeviceNotFoundException.class, () -> 
            deviceTrackingService.getDeviceStats("nonexistentHash")
        );

        verify(deviceRepository).findById("nonexistentHash");
        verify(deviceRepository, never()).save(any(Device.class));
        verify(loggingService).debug(anyString(), any(Object[].class));
        verify(loggingService).warn(anyString(), any(Object[].class));
        verify(loggingService).cacheOperation(anyString(), anyString(), anyBoolean());
        verify(loggingService).databaseOperation(anyString(), anyString(), anyLong());
    }
}