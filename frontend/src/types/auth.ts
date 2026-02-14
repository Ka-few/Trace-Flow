export type UserRole = 'Admin' | 'Producer' | 'Aggregator' | 'Exporter';

export interface UserDto {
    id: string;
    organizationId: string;
    email: string;
    fullName: string;
    role: UserRole;
    isActive: boolean;
}

export interface AuthResponse {
    token: string;
    user: UserDto;
}

export interface AuthState {
    user: UserDto | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}
