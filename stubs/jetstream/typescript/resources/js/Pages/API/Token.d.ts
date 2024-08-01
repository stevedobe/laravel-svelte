export interface Token {
    id: number;
    tokenable_type: string;
    tokenable_id: number;
    name: string;
    abilities: string[];
    last_used_at: string;
    last_used_ago: string;
    expires_at: string;
    created_at: string;
    updated_at: string;
}
