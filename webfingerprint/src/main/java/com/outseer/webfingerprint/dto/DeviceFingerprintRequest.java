package com.outseer.webfingerprint.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;
import java.util.Map;

@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class DeviceFingerprintRequest {
    // Basic browser information
    // Computed hash or deviceId
    private String hash;
    private String userAgent;
    private String language;
    private List<String> languages;
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

    // Default constructor
    public DeviceFingerprintRequest() {}

    // Getters and Setters
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

    public List<String> getLanguages() {
        return languages;
    }

    public void setLanguages(List<String> languages) {
        this.languages = languages;
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

    @JsonProperty("webGL")
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

    public String getHash() {
        return hash;
    }

    public void setHash(String hash) {
        this.hash = hash;
    }

    public String getScreenResolution() {
        return screenResolution;
    }

    public void setScreenResolution(String screenResolution) {
        this.screenResolution = screenResolution;
    }
}
