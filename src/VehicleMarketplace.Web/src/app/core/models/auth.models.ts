export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
}

export interface AuthResponse {
    token: string;
    refreshToken: string;
    user: User;
}

export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    roles: string[];
}
