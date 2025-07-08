"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const argon2_1 = __importDefault(require("argon2"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userService_1 = require("./userService");
const errorHandler_1 = require("../middleware/errorHandler");
class AuthService {
    constructor() {
        this.userService = new userService_1.UserService();
    }
    async register(email, password) {
        try {
            const hashedPassword = await argon2_1.default.hash(password, {
                type: argon2_1.default.argon2id,
                memoryCost: 2 ** 16,
                timeCost: 3,
                parallelism: 1,
            });
            const user = await this.userService.create({
                email,
                password: hashedPassword,
            });
            return user;
        }
        catch (error) {
            if (error instanceof errorHandler_1.AppError) {
                throw error;
            }
            throw new errorHandler_1.AppError('Registration failed', 500);
        }
    }
    async login(email, password) {
        try {
            const user = await this.userService.findByEmail(email);
            if (!user) {
                throw new errorHandler_1.AppError('Invalid credentials', 401);
            }
            const isValidPassword = await argon2_1.default.verify(user.password, password);
            if (!isValidPassword) {
                throw new errorHandler_1.AppError('Invalid credentials', 401);
            }
            return user;
        }
        catch (error) {
            if (error instanceof errorHandler_1.AppError) {
                throw error;
            }
            throw new errorHandler_1.AppError('Login failed', 500);
        }
    }
    generateToken(user) {
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            throw new errorHandler_1.AppError('JWT secret is not configured', 500);
        }
        const payload = {
            userId: user.id,
            email: user.email,
            role: user.role,
        };
        return jsonwebtoken_1.default.sign(payload, jwtSecret, {
            expiresIn: '1h',
            issuer: 'auth-service',
            audience: 'llm-aggregator',
        });
    }
    verifyToken(token) {
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            throw new errorHandler_1.AppError('JWT secret is not configured', 500);
        }
        try {
            return jsonwebtoken_1.default.verify(token, jwtSecret);
        }
        catch (error) {
            if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
                throw new errorHandler_1.AppError('Invalid token', 401);
            }
            else if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
                throw new errorHandler_1.AppError('Token expired', 401);
            }
            throw new errorHandler_1.AppError('Token verification failed', 401);
        }
    }
    async changePassword(userId, oldPassword, newPassword) {
        try {
            const user = await this.userService.findById(userId);
            if (!user) {
                throw new errorHandler_1.AppError('User not found', 404);
            }
            const isValidPassword = await argon2_1.default.verify(user.password, oldPassword);
            if (!isValidPassword) {
                throw new errorHandler_1.AppError('Invalid current password', 401);
            }
            const hashedPassword = await argon2_1.default.hash(newPassword, {
                type: argon2_1.default.argon2id,
                memoryCost: 2 ** 16,
                timeCost: 3,
                parallelism: 1,
            });
            await this.userService.update(userId, { password: hashedPassword });
        }
        catch (error) {
            if (error instanceof errorHandler_1.AppError) {
                throw error;
            }
            throw new errorHandler_1.AppError('Password change failed', 500);
        }
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=authService.js.map