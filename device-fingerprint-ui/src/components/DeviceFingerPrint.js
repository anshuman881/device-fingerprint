/**
 * Device Fingerprinting Utility
 * Collects various browser and device properties for unique identification
 * 
 * Note: This file intentionally uses ActiveXObject for legacy browser plugin detection.
 * Modern browsers will not have this object, so it's safely checked before use.
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
            // Core browser identity (most stable)
            userAgent: navigator.userAgent,
            language: navigator.language,
            platform: navigator.platform,
            
            // Browser capabilities (stable)
            cookiesEnabled: navigator.cookieEnabled,
            localStorage: (function () { try { return typeof window.localStorage !== 'undefined'; } catch (e) { return false; } })(),
            sessionStorage: (function () { try { return typeof window.sessionStorage !== 'undefined'; } catch (e) { return false; } })(),
            
            // Hardware info (very stable)
            hardwareConcurrency: navigator.hardwareConcurrency || 'unknown',
            deviceMemory: navigator.deviceMemory || 'unknown',
            maxTouchPoints: navigator.maxTouchPoints || 0,
            
            // Screen info (stable but may vary in incognito)
            screenResolution: `${window.screen.width}x${window.screen.height}`,
            colorDepth: window.screen.colorDepth,
            pixelDepth: window.screen.pixelDepth,
            
            // Timezone (stable)
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            
            // Browser features (stable)
            webGLSupported: !!window.WebGLRenderingContext,
            webRTCSupported: !!(window.RTCPeerConnection || window.webkitRTCPeerConnection),
            canvasSupported: !!document.createElement('canvas').getContext,
            
            // Stable fingerprints (normalized for consistency)
            webGL: this.getStableWebGLFingerprint(),
            canvas: this.getStableCanvasFingerprint(),
            plugins: this.getStablePlugins()
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

    // Get stable WebGL fingerprint (normalized for consistency)
    getStableWebGLFingerprint() {
        try {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            if (!gl) return 'webgl-not-supported';
            
            // Get basic WebGL parameters that are more stable
            const params = {
                maxTextureSize: gl.getParameter(gl.MAX_TEXTURE_SIZE),
                maxViewportDims: gl.getParameter(gl.MAX_VIEWPORT_DIMS),
                maxRenderbufferSize: gl.getParameter(gl.MAX_RENDERBUFFER_SIZE),
                aliasedLineWidthRange: gl.getParameter(gl.ALIASED_LINE_WIDTH_RANGE),
                aliasedPointSizeRange: gl.getParameter(gl.ALIASED_POINT_SIZE_RANGE)
            };
            
            // Try to get vendor/renderer if available (may be masked in incognito)
            try {
                const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
                if (debugInfo) {
                    params.vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) || 'unknown';
                    params.renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || 'unknown';
                }
            } catch (e) {
                params.vendor = 'masked';
                params.renderer = 'masked';
            }
            
            return params;
        } catch (e) {
            return 'webgl-error';
        }
    },

    // Get stable canvas fingerprint (normalized for consistency)
    getStableCanvasFingerprint() {
        try {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = 100;
            canvas.height = 50;
            
            // Use simple, consistent drawing that won't vary much
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, 100, 50);
            ctx.fillStyle = '#000000';
            ctx.font = '12px Arial';
            ctx.fillText('Device', 10, 20);
            ctx.fillText('Fingerprint', 10, 35);
            
            // Get a consistent hash of the canvas data
            const dataURL = canvas.toDataURL();
            return this.simpleHash(dataURL);
        } catch (e) {
            return 'canvas-not-supported';
        }
    },

    // Get list of installed plugins
    getPlugins() {
        try {
            const plugins = [];
            const knownPlugins = this.detectKnownPlugins();
            plugins.push(...knownPlugins);

            // Method 3: Check for PDF viewer capabilities
            if (this.hasPDFViewer()) {
                plugins.push({
                    name: 'PDF Viewer',
                    filename: 'pdf-viewer',
                    description: 'Built-in PDF viewing capability',
                    version: '1.0'
                });
            }

            // Method 4: Check for Flash (if still available)
            if (this.hasFlash()) {
                plugins.push({
                    name: 'Adobe Flash Player',
                    filename: 'flash-player',
                    description: 'Adobe Flash Player plugin',
                    version: '32.0'
                });
            }

            // Method 5: Check for Java (if available)
            if (this.hasJava()) {
                plugins.push({
                    name: 'Java Runtime Environment',
                    filename: 'java-runtime',
                    description: 'Oracle Java Runtime Environment',
                    version: '1.8'
                });
            }

            // Method 6: Check for Silverlight (if available)
            if (this.hasSilverlight()) {
                plugins.push({
                    name: 'Microsoft Silverlight',
                    filename: 'silverlight',
                    description: 'Microsoft Silverlight plugin',
                    version: '5.0'
                });
            }

            // Method 7: Check for QuickTime (if available)
            if (this.hasQuickTime()) {
                plugins.push({
                    name: 'QuickTime Plugin',
                    filename: 'quicktime',
                    description: 'Apple QuickTime media plugin',
                    version: '7.0'
                });
            }

            // Method 8: Check for Windows Media Player (if available)
            if (this.hasWindowsMedia()) {
                plugins.push({
                    name: 'Windows Media Player',
                    filename: 'wmp',
                    description: 'Microsoft Windows Media Player plugin',
                    version: '12.0'
                });
            }

            // Method 9: Check for RealPlayer (if available)
            if (this.hasRealPlayer()) {
                plugins.push({
                    name: 'RealPlayer',
                    filename: 'realplayer',
                    description: 'RealNetworks RealPlayer plugin',
                    version: '20.0'
                });
            }

            // Method 10: Check for VLC (if available)
            if (this.hasVLC()) {
                plugins.push({
                    name: 'VLC Media Player',
                    filename: 'vlc',
                    description: 'VideoLAN VLC media plugin',
                    version: '3.0'
                });
            }

            // Remove duplicates based on name
            const uniquePlugins = plugins.filter((plugin, index, self) =>
                index === self.findIndex(p => p.name === plugin.name)
            );
            return uniquePlugins;

        } catch (e) {
            // Return basic plugin detection as fallback
            return this.getBasicPlugins();
        }
    },

    // Helper method to detect known plugins using feature detection
    detectKnownPlugins() {
        const plugins = [];

        // Check for WebRTC
        if (window.RTCPeerConnection || window.webkitRTCPeerConnection || window.mozRTCPeerConnection) {
            plugins.push({
                name: 'WebRTC',
                filename: 'webrtc',
                description: 'Web Real-Time Communication',
                version: '1.0'
            });
        }

        // Check for WebGL
        if (window.WebGLRenderingContext || window.webkitWebGLRenderingContext || window.mozWebGLRenderingContext) {
            plugins.push({
                name: 'WebGL',
                filename: 'webgl',
                description: 'Web Graphics Library',
                version: '1.0'
            });
        }

        // Check for Canvas
        if (document.createElement('canvas').getContext) {
            plugins.push({
                name: 'Canvas',
                filename: 'canvas',
                description: 'HTML5 Canvas Support',
                version: '2.0'
            });
        }

        // Check for Audio/Video
        if (document.createElement('video').canPlayType || document.createElement('audio').canPlayType) {
            plugins.push({
                name: 'HTML5 Media',
                filename: 'html5-media',
                description: 'HTML5 Audio/Video Support',
                version: '1.0'
            });
        }

        // Check for Geolocation
        if (navigator.geolocation) {
            plugins.push({
                name: 'Geolocation',
                filename: 'geolocation',
                description: 'Geographic Location API',
                version: '1.0'
            });
        }

        // Check for Notifications
        if (window.Notification || window.webkitNotifications) {
            plugins.push({
                name: 'Notifications',
                filename: 'notifications',
                description: 'Web Notifications API',
                version: '1.0'
            });
        }

        // Check for Service Workers
        if ('serviceWorker' in navigator) {
            plugins.push({
                name: 'Service Worker',
                filename: 'service-worker',
                description: 'Service Worker API',
                version: '1.0'
            });
        }

        // Check for Push API
        if ('PushManager' in window) {
            plugins.push({
                name: 'Push API',
                filename: 'push-api',
                description: 'Push Notifications API',
                version: '1.0'
            });
        }

        return plugins;
    },

    // Check for PDF viewer capability
    hasPDFViewer() {
        try {
            // Check if browser can display PDFs
            const testLink = document.createElement('a');
            testLink.href = 'data:application/pdf;base64,JVBERi0xLjQKJcOkw7zDtsO';
            return testLink.href !== '';
        } catch (e) {
            return false;
        }
    },

    // Check for Flash (legacy)
    hasFlash() {
        try {
            if (navigator.mimeTypes && navigator.mimeTypes['application/x-shockwave-flash']) {
                return true;
            }
            if (typeof window.ActiveXObject !== 'undefined') {
                try {
                    new window.ActiveXObject('ShockwaveFlash.ShockwaveFlash');
                    return true;
                } catch (e) {
                    return false;
                }
            }
            return false;
        } catch (e) {
            return false;
        }
    },

    // Check for Java (legacy)
    hasJava() {
        try {
            if (navigator.mimeTypes && navigator.mimeTypes['application/x-java-applet']) {
                return true;
            }
            if (typeof window.ActiveXObject !== 'undefined') {
                try {
                    new window.ActiveXObject('JavaPlugin.160_01');
                    return true;
                } catch (e) {
                    return false;
                }
            }
            return false;
        } catch (e) {
            return false;
        }
    },

    // Check for Silverlight (legacy)
    hasSilverlight() {
        try {
            if (navigator.mimeTypes && navigator.mimeTypes['application/x-silverlight-app']) {
                return true;
            }
            if (typeof window.ActiveXObject !== 'undefined') {
                try {
                    new window.ActiveXObject('AgControl.AgControl');
                    return false;
                } catch (e) {
                    return false;
                }
            }
            return false;
        } catch (e) {
            return false;
        }
    },

    // Check for QuickTime (legacy)
    hasQuickTime() {
        try {
            if (navigator.mimeTypes && navigator.mimeTypes['video/quicktime']) {
                return true;
            }
            if (typeof window.ActiveXObject !== 'undefined') {
                try {
                    new window.ActiveXObject('QuickTime.QuickTime');
                    return true;
                } catch (e) {
                    return false;
                }
            }
            return false;
        } catch (e) {
            return false;
        }
    },

    // Check for Windows Media Player (legacy)
    hasWindowsMedia() {
        try {
            if (navigator.mimeTypes && navigator.mimeTypes['video/x-ms-wmv']) {
                return true;
            }
            if (typeof window.ActiveXObject !== 'undefined') {
                try {
                    new window.ActiveXObject('MediaPlayer.MediaPlayer');
                    return true;
                } catch (e) {
                    return false;
                }
            }
            return false;
        } catch (e) {
            return false;
        }
    },

    // Check for RealPlayer (legacy)
    hasRealPlayer() {
        try {
            if (navigator.mimeTypes && navigator.mimeTypes['audio/x-pn-realaudio-plugin']) {
                return true;
            }
            if (typeof window.ActiveXObject !== 'undefined') {
                try {
                    new window.ActiveXObject('RealPlayer.RealPlayer');
                    return true;
                } catch (e) {
                    return false;
                }
            }
            return false;
        } catch (e) {
            return false;
        }
    },

    // Check for VLC (legacy)
    hasVLC() {
        try {
            if (navigator.mimeTypes && navigator.mimeTypes['application/x-vlc-plugin']) {
                return true;
            }
            if (typeof window.ActiveXObject !== 'undefined') {
                try {
                    new window.ActiveXObject('VideoLAN.VLCPlugin');
                    return true;
                } catch (e) {
                    return false;
                }
            }
            return false;
        } catch (e) {
            return false;
        }
    },

    // Fallback method for basic plugin detection
    getBasicPlugins() {
        console.log('🔄 Using basic plugin detection fallback...');
        const basicPlugins = [];

        // Always include basic browser capabilities
        basicPlugins.push({
            name: 'JavaScript',
            filename: 'javascript',
            description: 'JavaScript Runtime',
            version: '1.0'
        });

        if (document.createElement('canvas').getContext) {
            basicPlugins.push({
                name: 'Canvas',
                filename: 'canvas',
                description: 'HTML5 Canvas Support',
                version: '2.0'
            });
        }

        if (window.WebGLRenderingContext) {
            basicPlugins.push({
                name: 'WebGL',
                filename: 'webgl',
                description: 'Web Graphics Library',
                version: '1.0'
            });
        }

        console.log('🔄 Basic plugins detected:', basicPlugins);
        return basicPlugins;
    },

    // Get stable plugins (normalized for consistency across modes)
    getStablePlugins() {
        try {
            const plugins = [];
            
            // Core browser capabilities (always stable)
            plugins.push({
                name: 'JavaScript',
                filename: 'javascript',
                description: 'JavaScript Runtime',
                version: '1.0'
            });
            
            // HTML5 features (stable)
            if (document.createElement('canvas').getContext) {
                plugins.push({
                    name: 'Canvas',
                    filename: 'canvas',
                    description: 'HTML5 Canvas Support',
                    version: '2.0'
                });
            }
            
            if (window.WebGLRenderingContext) {
                plugins.push({
                    name: 'WebGL',
                    filename: 'webgl',
                    description: 'Web Graphics Library',
                    version: '1.0'
                });
            }
            
            if (window.RTCPeerConnection || window.webkitRTCPeerConnection) {
                plugins.push({
                    name: 'WebRTC',
                    filename: 'webrtc',
                    description: 'Web Real-Time Communication',
                    version: '1.0'
                });
            }
            
            if (document.createElement('video').canPlayType) {
                plugins.push({
                    name: 'HTML5 Media',
                    filename: 'html5-media',
                    description: 'HTML5 Audio/Video Support',
                    version: '1.0'
                });
            }
            
            if (navigator.geolocation) {
                plugins.push({
                    name: 'Geolocation',
                    filename: 'geolocation',
                    description: 'Geographic Location API',
                    version: '1.0'
                });
            }
            
            // Don't include legacy plugins that may vary in incognito
            // Focus on core browser capabilities that are consistent
            
            return plugins;
        } catch (e) {
            return this.getBasicPlugins();
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

    // Generate a more consistent hash that works better across incognito modes
    getConsistentHashCode() {
        const coreFingerprint = this.getCoreFingerprint();
        console.log("coreFingerprint (consistent):", coreFingerprint);
        return this.simpleHash(JSON.stringify(coreFingerprint));
    },

    // Get core fingerprint with only the most stable properties
    getCoreFingerprint() {
        return {
            // Browser identity (most stable)
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            language: navigator.language,
            
            // Hardware (very stable)
            hardwareConcurrency: navigator.hardwareConcurrency || 'unknown',
            deviceMemory: navigator.deviceMemory || 'unknown',
            maxTouchPoints: navigator.maxTouchPoints || 0,
            
            // Screen (stable)
            screenResolution: `${window.screen.width}x${window.screen.height}`,
            colorDepth: window.screen.colorDepth,
            
            // Browser capabilities (stable)
            webGLSupported: !!window.WebGLRenderingContext,
            webRTCSupported: !!(window.RTCPeerConnection || window.webkitRTCPeerConnection),
            canvasSupported: !!document.createElement('canvas').getContext,
            
            // Timezone (stable)
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        };
    },

    // Get ultra-stable fingerprint (only properties that browsers cannot mask)
    getUltraStableFingerprint() {
        return {
            // These properties are extremely hard for browsers to fake
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            language: navigator.language,
            hardwareConcurrency: navigator.hardwareConcurrency || 'unknown',
            deviceMemory: navigator.deviceMemory || 'unknown',
            maxTouchPoints: navigator.maxTouchPoints || 0,
            screenResolution: `${window.screen.width}x${window.screen.height}`,
            colorDepth: window.screen.colorDepth
        };
    },

    // Generate ultra-stable hash that should be identical across modes
    getUltraStableHashCode() {
        const ultraStable = this.getUltraStableFingerprint();
        console.log("ultraStable fingerprint:", ultraStable);
        return this.simpleHash(JSON.stringify(ultraStable));
    },

    // Generate hash based on user agent only (most stable)
    getUserAgentHashCode() {
        const userAgentData = {
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            language: navigator.language
        };
        console.log("userAgent fingerprint:", userAgentData);
        return this.simpleHash(JSON.stringify(userAgentData));
    },

    // Test all hash methods to compare consistency
    testAllHashMethods() {
        console.log('=== Testing All Hash Methods ===');
        
        const hashes = {
            full: this.getHashCode(),
            consistent: this.getConsistentHashCode(),
            ultraStable: this.getUltraStableHashCode(),
            userAgent: this.getUserAgentHashCode()
        };
        
        console.log('🔍 Hash Comparison:');
        console.log('Full Hash (may vary):', hashes.full);
        console.log('Consistent Hash:', hashes.consistent);
        console.log('Ultra-Stable Hash:', hashes.ultraStable);
        console.log('User Agent Hash:', hashes.userAgent);
        
        // Check which hashes are the same
        const uniqueHashes = [...new Set(Object.values(hashes))];
        console.log('📊 Unique hashes found:', uniqueHashes.length);
        console.log('🔄 Hash consistency:', uniqueHashes.length === 1 ? 'PERFECT' : 'VARIED');
        
        return hashes;
    },
};

export default DeviceFingerprint;