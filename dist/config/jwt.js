"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateJWTSecret = exports.cookieConfig = exports.jwtConfig = void 0;
exports.jwtConfig = {
    secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
    expiresIn: '1h',
    issuer: 'auth-service',
    audience: 'llm-aggregator',
    algorithm: 'HS256',
};
exports.cookieConfig = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 1000,
};
const validateJWTSecret = () => {
    if (!process.env.JWT_SECRET) {
        console.error('❌ JWT_SECRET environment variable is required');
        process.exit(1);
    }
    if (process.env.JWT_SECRET.length < 32) {
        console.error('❌ JWT_SECRET must be at least 32 characters long');
        process.exit(1);
    }
};
exports.validateJWTSecret = validateJWTSecret;
//# sourceMappingURL=jwt.js.map