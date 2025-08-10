package com.outseer.webfingerprint.dto;

public class DeviceTrackingResponse {
    private String deviceId;
    private long ageMinutes;
    private boolean isNewDevice;
    private String message;
    private int visitCount;
    private String status;

    // Default constructor
    public DeviceTrackingResponse() {}

    // Constructor with parameters
    public DeviceTrackingResponse(String deviceId, long ageMinutes, boolean isNewDevice, String message,int visitCount,String status) {
        this.deviceId = deviceId;
        this.ageMinutes = ageMinutes;
        this.isNewDevice = isNewDevice;
        this.message = message;
        this.visitCount = visitCount;
        this.status = status;
    }

    // Getters and Setters
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

    public boolean isNewDevice() {
        return isNewDevice;
    }

    public void setNewDevice(boolean newDevice) {
        isNewDevice = newDevice;
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
}
