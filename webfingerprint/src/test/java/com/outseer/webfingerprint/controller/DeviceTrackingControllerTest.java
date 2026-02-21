package com.outseer.webfingerprint.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.outseer.webfingerprint.dto.DeviceFingerprintRequest;
import com.outseer.webfingerprint.dto.DeviceTrackingResponse;
import com.outseer.webfingerprint.service.DeviceTrackingService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import com.outseer.webfingerprint.exception.DeviceNotFoundException;

@SpringBootTest
@AutoConfigureMockMvc
class DeviceTrackingControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Mock
    private DeviceTrackingService deviceTrackingService;

    @Autowired
    private ObjectMapper objectMapper;

    private DeviceFingerprintRequest request;
    private DeviceTrackingResponse response;

    @BeforeEach
    void setUp() {
        request = new DeviceFingerprintRequest();
        request.setHash("testHash");
        request.setUserAgent("testAgent");
        request.setPlatform("testPlatform");
        request.setScreenResolution("1920x1080");
        request.setTimezone("UTC");
        request.setLanguage("en");
        request.setCookiesEnabled(true);
        request.setPlugins(List.of(Map.of("name", "testPlugin")));
        request.setCanvas("testCanvas");
        request.setWebGLFingerprint("testWebGL");
        request.setTouchSupport(false);
        request.setDeviceMemory(8);
        request.setHardwareConcurrency(4);

        response = new DeviceTrackingResponse("testHash", 10L, "Welcome back! This is your 10 visit.", 10, "success", LocalDateTime.now().minusDays(1), LocalDateTime.now());
    }

    @Test
    void getStats_ShouldReturnNotFound_WhenDeviceDoesNotExist() throws Exception {
        when(deviceTrackingService.getDeviceStats(anyString()))
            .thenThrow(new DeviceNotFoundException("Device Not Found"));

        mockMvc.perform(get("/api/device/{id}", "nonExistentHash"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value("not_found"));
    }
}