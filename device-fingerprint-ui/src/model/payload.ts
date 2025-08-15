export interface DeviceFingerprintPayload {
    hash: string;
    userAgent: string;
    language: string;
    platform: string;
    screenResolution: string;
    timezone: string;
    cookiesEnabled?: boolean;
    plugins?: Array<{
        name: string;
        description: string;
    }>;
    canvas?: string;
    webGL?: any;
    touchSupport?: boolean;
    deviceMemory?: number;
    hardwareConcurrency?: number;
}