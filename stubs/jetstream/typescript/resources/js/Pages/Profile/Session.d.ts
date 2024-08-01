export interface Session {
    ip_address: string;
    agent: {
        browser: string;
        is_desktop: boolean;
        platform: string;
    };
    is_current_device: boolean;
    last_active: string;
}
