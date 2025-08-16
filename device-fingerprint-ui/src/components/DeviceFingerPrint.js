/**
 * Device Fingerprinting Utility
 * Collects various browser and device properties for unique identification
 */

const DeviceFingerprint = {
    // Generate a hash from a string (simple hash function for demo)
    simpleHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return Math.abs(hash).toString(16);
    },

    // Get stable fingerprint components (excluding dynamic properties)
    getStableFingerprint() {
        return {
            userAgent: navigator.userAgent,
            language: navigator.language,
            platform: navigator.platform,
            cookiesEnabled: navigator.cookieEnabled,
            localStorage: (function () { try { return typeof window.localStorage !== 'undefined'; } catch (e) { return false; } })(),

            // Screen info (stable)
            screenResolution: `${window.screen.width}x${window.screen.height}`,
            colorDepth: window.screen.colorDepth,
            pixelDepth: window.screen.pixelDepth,

            // Timezone
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,

            // Browser capabilities
            webGLSupported: !!window.WebGLRenderingContext,

            // Hardware info
            touchSupport: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
            deviceMemory: navigator.deviceMemory || 'unknown',
            hardwareConcurrency: navigator.hardwareConcurrency || 'unknown',

            // Stable canvas fingerprint and GL info
            webGL: this.getWebGLFingerprint(),
            plugins: this.getPlugins()
        };
    },

    // Get canvas fingerprint
    getCanvasFingerprint() {
        try {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = 200;
            canvas.height = 50;
            // Draw some text and shapes
            ctx.textBaseline = 'top';
            ctx.font = '14px Arial';
            ctx.fillText('Device fingerprint canvas', 2, 2);
            ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
            ctx.fillRect(100, 5, 80, 20);
            return canvas.toDataURL();
        } catch (e) {
            return 'canvas-not-supported';
        }
    },

    // Get WebGL fingerprint
    getWebGLFingerprint() {
        try {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            if (!gl) return 'webgl-not-supported';
            const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
            return {
                vendor: gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL),
                renderer: gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
            };
        } catch (e) {
            return 'webgl-error';
        }
    },

    // Get list of installed plugins
    getPlugins() {
        try {
            return Array.from(navigator.plugins).map(plugin => ({
                name: plugin.name,
                filename: plugin.filename,
                description: plugin.description
            }));
        } catch (e) {
            return [];
        }
    },

    collect() {
        // Generate a stable hash from stable components only
        return this.getStableFingerprint();
    },

    getHashCode() {
        const stableComponents = this.getStableFingerprint();
        console.log("stableComponents", stableComponents);
        return this.simpleHash(JSON.stringify(stableComponents));
    },

    // Get hardware-specific fingerprint components (consistent across browsers)
    getHardwareFingerprint() {
        return {
            // Screen hardware info (stable across browsers)
            screenResolution: `${window.screen.width}x${window.screen.height}`,
            screenAvailResolution: `${window.screen.availWidth}x${window.screen.availHeight}`,
            colorDepth: window.screen.colorDepth,
            pixelDepth: window.screen.pixelDepth,

            // Timezone (generally consistent across browsers on same system)
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            timezoneOffset: new Date().getTimezoneOffset(),

            // Hardware info (consistent across browsers)
            touchSupport: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
            deviceMemory: navigator.deviceMemory || 'unknown',
            hardwareConcurrency: navigator.hardwareConcurrency || 'unknown',

            // Platform info (more stable than userAgent)
            platform: navigator.platform,

            // Basic capabilities (usually consistent)
            cookiesEnabled: navigator.cookieEnabled,
            localStorage: (function () { try { return typeof window.localStorage !== 'undefined'; } catch (e) { return false; } })(),
            webGLSupported: !!window.WebGLRenderingContext,

            // Hardware-based canvas fingerprint (avoid text rendering which can vary)
            canvasHardwareHash: this.getHardwareBasedCanvasFingerprint(),

            // Screen orientation capability
            orientationSupport: 'orientation' in window || 'screen' in window && 'orientation' in window.screen
        };
    },

    // Get hardware-based canvas fingerprint (more consistent across browsers)
    getHardwareBasedCanvasFingerprint() {
        try {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = 200;
            canvas.height = 50;

            // Use geometric shapes only (no text which can vary between browsers)
            ctx.fillStyle = '#000000';
            ctx.fillRect(0, 0, 200, 50);
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(10, 10, 180, 30);

            // Simple geometric shapes that rely on hardware rendering
            ctx.beginPath();
            ctx.arc(50, 25, 15, 0, 2 * Math.PI);
            ctx.fill();

            ctx.fillRect(100, 15, 20, 20);
            ctx.beginPath();
            ctx.moveTo(150, 15);
            ctx.lineTo(170, 25);
            ctx.lineTo(150, 35);
            ctx.closePath();
            ctx.fill();

            // Get image data and create a simple hash
            const imageData = ctx.getImageData(0, 0, 200, 50);
            let hash = 0;
            for (let i = 0; i < imageData.data.length; i += 10) { // Sample every 10th pixel for performance
                hash = ((hash << 3) - hash) + imageData.data[i];
                hash = hash & hash;
            }
            return Math.abs(hash).toString(16);
        } catch (e) {
            return 'canvas-not-supported';
        }
    },

    // Get cross-browser consistent hash code
    getCrossBrowserHashCode() {
        const hardwareComponents = this.getHardwareFingerprint();
        console.log("hardwareComponents (cross-browser)", hardwareComponents);
        return this.simpleHash(JSON.stringify(hardwareComponents));
    },
};

export default DeviceFingerprint;