import { Role } from '@prisma/client';
export interface JWTPayload {
    userId: string;
    email: string;
    role: Role;
    iat?: number;
    exp?: number;
    iss?: string;
    aud?: string;
}
export interface LoginRequest {
    email: string;
    password: string;
}
export interface RegisterRequest {
    email: string;
    password: string;
}
export interface AuthResponse {
    success: boolean;
    message: string;
    user: {
        id: string;
        email: string;
        role: Role;
        createdAt: Date;
    };
}
export interface UserResponse {
    id: string;
    email: string;
    role: Role;
    createdAt: Date;
}
export interface ErrorResponse {
    success: false;
    error: string;
    timestamp: string;
    details?: any;
}
export interface SuccessResponse<T = any> {
    success: true;
    data?: T;
    message?: string;
    timestamp?: string;
}
//# sourceMappingURL=auth.d.ts.map