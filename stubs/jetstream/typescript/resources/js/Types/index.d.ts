interface Membership {
    team_id: number;
    user_id: number;
    role: string;
    created_at: string;
    updated_at: string;
}

export interface Permissions {
    canAddTeamMembers: boolean;
    canDeleteTeam: boolean;
    canRemoveTeamMembers: boolean;
    canUpdateTeam: boolean;
    canUpdateTeamMembers: boolean;
}

export interface Role {
    key: string;
    name: string;
    description: string;
    permissions: string[];
}

export interface Team {
    id: number;
    name: string;
    personal_team: boolean;
    user_id: number;
    owner: User;
    users: User[];
    membership: Membership;
    team_invitations: TeamInvitation[];
    created_at: string;
    updated_at: string;
}

export interface TeamInvitation {
    id: number;
    team_id: number;
    email: string;
    role: string;
    created_at: string;
    updated_at: string;
}

export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    all_teams?: Team[];
    current_team?: Team;
    current_team_id: number;
    membership: Membership;
    profile_photo_path: string | null;
    profile_photo_url: string;
    two_factor_confirmed_at: string | null;
    two_factor_enabled?: boolean;
    created_at: string;
    updated_at: string;
}
