package com.outseer.webfingerprint.dto;

import java.sql.Timestamp;
import java.time.LocalDateTime;

public class DeviceTrackingResponse {
    private String deviceId;
    private long ageMinutes;
    private String message;
    private int visitCount;
    private String status;
    private LocalDateTime firstSeen;
    private LocalDateTime lastSeen;

    public DeviceTrackingResponse(){}

    public DeviceTrackingResponse(String deviceId, long ageMinutes, String message, int visitCount, String status, LocalDateTime firstSeen, LocalDateTime lastSeen) {
        this.deviceId = deviceId;
        this.ageMinutes = ageMinutes;
        this.message = message;
        this.visitCount = visitCount;
        this.status = status;
        this.firstSeen = firstSeen;
        this.lastSeen = lastSeen;
    }

    public String getDeviceId() {
        return deviceId;
    }

    public void setDeviceId(String deviceId) {
        this.deviceId = deviceId;
    }

    public long getAgeMinutes() {
        return ageMinutes;
    }

    public void setAgeMinutes(long ageMinutes) {
        this.ageMinutes = ageMinutes;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public int getVisitCount() {
        return visitCount;
    }

    public void setVisitCount(int visitCount) {
        this.visitCount = visitCount;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getFirstSeen() {
        return firstSeen;
    }

    public void setFirstSeen(LocalDateTime firstSeen) {
        this.firstSeen = firstSeen;
    }

    public LocalDateTime getLastSeen() {
        return lastSeen;
    }

    public void setLastSeen(LocalDateTime lastSeen) {
        this.lastSeen = lastSeen;
    }
}
