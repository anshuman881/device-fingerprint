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
    }
};

export default DeviceFingerprint;