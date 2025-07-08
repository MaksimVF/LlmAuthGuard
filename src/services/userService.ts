import { PrismaClient, User, Role } from '@prisma/client';
import { AppError } from '../middleware/errorHandler';

const prisma = new PrismaClient();

export class UserService {
  /**
   * Find user by ID
   */
  async findById(id: string): Promise<User | null> {
    try {
      return await prisma.user.findUnique({
        where: { id },
      });
    } catch (error) {
      throw new AppError('Error finding user', 500);
    }
  }

  /**
   * Find user by email
   */
  async findByEmail(email: string): Promise<User | null> {
    try {
      return await prisma.user.findUnique({
        where: { email },
      });
    } catch (error) {
      throw new AppError('Error finding user', 500);
    }
  }

  /**
   * Create a new user
   */
  async create(data: {
    email: string;
    password: string;
    role?: Role;
  }): Promise<User> {
    try {
      return await prisma.user.create({
        data: {
          email: data.email,
          password: data.password,
          role: data.role || 'USER',
        },
      });
    } catch (error) {
      throw new AppError('Error creating user', 500);
    }
  }

  /**
   * Update user
   */
  async update(id: string, data: Partial<User>): Promise<User> {
    try {
      return await prisma.user.update({
        where: { id },
        data,
      });
    } catch (error) {
      throw new AppError('Error updating user', 500);
    }
  }

  /**
   * Delete user
   */
  async delete(id: string): Promise<User> {
    try {
      return await prisma.user.delete({
        where: { id },
      });
    } catch (error) {
      throw new AppError('Error deleting user', 500);
    }
  }

  /**
   * Get all users (admin only)
   */
  async findAll(limit = 50, offset = 0): Promise<User[]> {
    try {
      return await prisma.user.findMany({
        take: limit,
        skip: offset,
        orderBy: { createdAt: 'desc' },
      });
    } catch (error) {
      throw new AppError('Error fetching users', 500);
    }
  }

  /**
   * Count total users
   */
  async count(): Promise<number> {
    try {
      return await prisma.user.count();
    } catch (error) {
      throw new AppError('Error counting users', 500);
    }
  }
}
