"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const client_1 = require("@prisma/client");
const errorHandler_1 = require("../middleware/errorHandler");
const prisma = new client_1.PrismaClient();
class UserService {
    async findById(id) {
        try {
            return await prisma.user.findUnique({
                where: { id },
            });
        }
        catch (error) {
            throw new errorHandler_1.AppError('Error finding user', 500);
        }
    }
    async findByEmail(email) {
        try {
            return await prisma.user.findUnique({
                where: { email },
            });
        }
        catch (error) {
            throw new errorHandler_1.AppError('Error finding user', 500);
        }
    }
    async create(data) {
        try {
            return await prisma.user.create({
                data: {
                    email: data.email,
                    password: data.password,
                    role: data.role || 'USER',
                },
            });
        }
        catch (error) {
            throw new errorHandler_1.AppError('Error creating user', 500);
        }
    }
    async update(id, data) {
        try {
            return await prisma.user.update({
                where: { id },
                data,
            });
        }
        catch (error) {
            throw new errorHandler_1.AppError('Error updating user', 500);
        }
    }
    async delete(id) {
        try {
            return await prisma.user.delete({
                where: { id },
            });
        }
        catch (error) {
            throw new errorHandler_1.AppError('Error deleting user', 500);
        }
    }
    async findAll(limit = 50, offset = 0) {
        try {
            return await prisma.user.findMany({
                take: limit,
                skip: offset,
                orderBy: { createdAt: 'desc' },
            });
        }
        catch (error) {
            throw new errorHandler_1.AppError('Error fetching users', 500);
        }
    }
    async count() {
        try {
            return await prisma.user.count();
        }
        catch (error) {
            throw new errorHandler_1.AppError('Error counting users', 500);
        }
    }
}
exports.UserService = UserService;
//# sourceMappingURL=userService.js.map