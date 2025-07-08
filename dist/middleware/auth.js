"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionalAuth = exports.requireAdmin = exports.requireRole = exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userService_1 = require("../services/userService");
const errorHandler_1 = require("./errorHandler");
const userService = new userService_1.UserService();
const authenticateToken = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            throw new errorHandler_1.AppError('Access token is required', 401);
        }
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            throw new errorHandler_1.AppError('JWT secret is not configured', 500);
        }
        const decoded = jsonwebtoken_1.default.verify(token, jwtSecret);
        const user = await userService.findById(decoded.userId);
        if (!user) {
            throw new errorHandler_1.AppError('User not found', 401);
        }
        req.user = {
            id: user.id,
            email: user.email,
            role: user.role,
        };
        next();
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            next(new errorHandler_1.AppError('Invalid token', 401));
        }
        else if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            next(new errorHandler_1.AppError('Token expired', 401));
        }
        else {
            next(error);
        }
    }
};
exports.authenticateToken = authenticateToken;
const requireRole = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            throw new errorHandler_1.AppError('Authentication required', 401);
        }
        if (!roles.includes(req.user.role)) {
            throw new errorHandler_1.AppError('Insufficient permissions', 403);
        }
        next();
    };
};
exports.requireRole = requireRole;
exports.requireAdmin = (0, exports.requireRole)(['ADMIN']);
const optionalAuth = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return next();
        }
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            return next();
        }
        const decoded = jsonwebtoken_1.default.verify(token, jwtSecret);
        const user = await userService.findById(decoded.userId);
        if (user) {
            req.user = {
                id: user.id,
                email: user.email,
                role: user.role,
            };
        }
        next();
    }
    catch (error) {
        next();
    }
};
exports.optionalAuth = optionalAuth;
//# sourceMappingURL=auth.js.map