import { User, UserRole } from './index';

export interface LoginCredentials {
    username: string;
    password: string;
}

export interface RegisterData {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    role: UserRole;
    displayName: string;
    classCode?: string; // для учеников
}

export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}