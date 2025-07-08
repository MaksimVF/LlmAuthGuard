import { User, Role } from '@prisma/client';
export declare class UserService {
    findById(id: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    create(data: {
        email: string;
        password: string;
        role?: Role;
    }): Promise<User>;
    update(id: string, data: Partial<User>): Promise<User>;
    delete(id: string): Promise<User>;
    findAll(limit?: number, offset?: number): Promise<User[]>;
    count(): Promise<number>;
}
//# sourceMappingURL=userService.d.ts.map