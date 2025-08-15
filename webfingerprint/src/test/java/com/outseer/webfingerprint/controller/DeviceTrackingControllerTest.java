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

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

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

        response = new DeviceTrackingResponse("NA",0L,"NA",0,"NA", LocalDateTime.now(),LocalDateTime.now());
    }

    @Test
    void trackDevice_ShouldReturnSuccess() throws Exception {
        when(deviceTrackingService.createDeviceInfo(any(DeviceFingerprintRequest.class)))
            .thenReturn(response);

        mockMvc.perform(post("/api/device")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.deviceId").value("testHash"))
                .andExpect(jsonPath("$.status").value("success"));
    }

    @Test
    void getStats_ShouldReturnStats_WhenDeviceExists() throws Exception {
        when(deviceTrackingService.getDeviceStats("testHash"))
            .thenReturn(response);

        mockMvc.perform(get("/api/device/{id}", "testHash"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.deviceId").value("testHash"))
                .andExpect(jsonPath("$.status").value("success"));
    }
}