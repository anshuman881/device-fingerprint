package com.outseer.webfingerprint.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.constraints.NotNull;

import java.util.List;
import java.util.Map;

@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class DeviceFingerprintRequest {
    // Basic browser information
    // Computed hash or deviceId
    @NotNull(message = "Hash cannot be null")
    private String hash;
    private String userAgent;
    private String language;
    private String platform;
    private Boolean cookiesEnabled;
    private String screenResolution;

    // Time zone information
    private String timezone;

    // Graphics and rendering
    private List<Map<String, String>> plugins;
    private String canvas;
    private Object webGLFingerprint;

    // Device capabilities
    private Boolean touchSupport;
    private Object deviceMemory;
    private Object hardwareConcurrency;

    public DeviceFingerprintRequest(){}

    public DeviceFingerprintRequest(String hash, String userAgent, String language, String platform, Boolean cookiesEnabled, String screenResolution, String timezone, List<Map<String, String>> plugins, String canvas, Object webGLFingerprint, Boolean touchSupport, Object deviceMemory, Object hardwareConcurrency) {
        this.hash = hash;
        this.userAgent = userAgent;
        this.language = language;
        this.platform = platform;
        this.cookiesEnabled = cookiesEnabled;
        this.screenResolution = screenResolution;
        this.timezone = timezone;
        this.plugins = plugins;
        this.canvas = canvas;
        this.webGLFingerprint = webGLFingerprint;
        this.touchSupport = touchSupport;
        this.deviceMemory = deviceMemory;
        this.hardwareConcurrency = hardwareConcurrency;
    }

    public String getHash() {
        return hash;
    }

    public void setHash(String hash) {
        this.hash = hash;
    }

    public String getUserAgent() {
        return userAgent;
    }

    public void setUserAgent(String userAgent) {
        this.userAgent = userAgent;
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

    public Boolean getCookiesEnabled() {
        return cookiesEnabled;
    }

    public void setCookiesEnabled(Boolean cookiesEnabled) {
        this.cookiesEnabled = cookiesEnabled;
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

    public List<Map<String, String>> getPlugins() {
        return plugins;
    }

    public void setPlugins(List<Map<String, String>> plugins) {
        this.plugins = plugins;
    }

    public String getCanvas() {
        return canvas;
    }

    public void setCanvas(String canvas) {
        this.canvas = canvas;
    }

    public Object getWebGLFingerprint() {
        return webGLFingerprint;
    }

    public void setWebGLFingerprint(Object webGLFingerprint) {
        this.webGLFingerprint = webGLFingerprint;
    }

    public Boolean getTouchSupport() {
        return touchSupport;
    }

    public void setTouchSupport(Boolean touchSupport) {
        this.touchSupport = touchSupport;
    }

    public Object getDeviceMemory() {
        return deviceMemory;
    }

    public void setDeviceMemory(Object deviceMemory) {
        this.deviceMemory = deviceMemory;
    }

    public Object getHardwareConcurrency() {
        return hardwareConcurrency;
    }

    public void setHardwareConcurrency(Object hardwareConcurrency) {
        this.hardwareConcurrency = hardwareConcurrency;
    }
}
