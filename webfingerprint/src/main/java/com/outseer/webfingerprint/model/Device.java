package com.outseer.webfingerprint.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.Objects;

@Entity
@Table(name = "devices")
public class Device {
    @Id
    @Column(name = "device_id")
    private String deviceId;

    @Column(name = "first_seen", nullable = false)
    private LocalDateTime firstSeen;

    @Column(name = "last_seen", nullable = false)
    private LocalDateTime lastSeen;

    @Column(name = "user_agent", length = 1000)
    private String userAgent;

    @Column(name = "screen_resolution")
    private String screenResolution;

    @Column(name = "timezone")
    private String timezone;

    @Column(name = "language")
    private String language;

    @Column(name = "platform")
    private String platform;

    @Column(name = "visit_count")
    private Integer visitCount = 1;

    // Default constructor
    public Device() {
    }

    // Constructor with all required fields
    public Device(String deviceId, String userAgent,
                  String screenResolution, String timezone, String language, String platform) {
        this.deviceId = deviceId;
        this.userAgent = userAgent;
        this.screenResolution = screenResolution;
        this.timezone = timezone;
        this.language = language;
        this.platform = platform;
        this.firstSeen = LocalDateTime.now();
        this.lastSeen = LocalDateTime.now();
    }

    // Getters and Setters
    public String getDeviceId() {
        return deviceId;
    }

    public void setDeviceId(String deviceId) {
        this.deviceId = deviceId;
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

    public String getUserAgent() {
        return userAgent;
    }

    public void setUserAgent(String userAgent) {
        this.userAgent = userAgent;
    }

    public String getScreenResolution() {
        return screenResolution;
    }

    public void setScreenResolution(String screenResolution) {
        this.screenResolution = screenResolution;
    }

    public String getTimezone() {
        return timezone;
    }

    public void setTimezone(String timezone) {
        this.timezone = timezone;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public String getPlatform() {
        return platform;
    }

    public void setPlatform(String platform) {
        this.platform = platform;
    }

    public Integer getVisitCount() {
        return visitCount;
    }

    public void setVisitCount(Integer visitCount) {
        this.visitCount = visitCount;
    }

    public void incrementVisitCount() {
        this.visitCount++;
        this.lastSeen = LocalDateTime.now();
    }

    // equals, hashCode, and toString methods
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Device device = (Device) o;
        return Objects.equals(deviceId, device.deviceId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(deviceId);
    }

    @Override
    public String toString() {
        return "Device{" +
                "deviceId='" + deviceId + '\'' +
                ", firstSeen=" + firstSeen +
                ", lastSeen=" + lastSeen +
                ", userAgent='" + userAgent + '\'' +
                ", screenResolution='" + screenResolution + '\'' +
                ", timezone='" + timezone + '\'' +
                ", language='" + language + '\'' +
                ", platform='" + platform + '\'' +
                ", visitCount=" + visitCount +
                '}';
    }
}
