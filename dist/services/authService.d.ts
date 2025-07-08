import { User } from '@prisma/client';
import { JWTPayload } from '../types/auth';
export declare class AuthService {
    private userService;
    constructor();
    register(email: string, password: string): Promise<User>;
    login(email: string, password: string): Promise<User>;
    generateToken(user: User): string;
    verifyToken(token: string): JWTPayload;
    changePassword(userId: string, oldPassword: string, newPassword: string): Promise<void>;
}
//# sourceMappingURL=authService.d.ts.map