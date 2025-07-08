import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import { User } from '@prisma/client';
import { UserService } from './userService';
import { AppError } from '../middleware/errorHandler';
import { JWTPayload } from '../types/auth';

export class AuthService {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  /**
   * Register a new user
   */
  async register(email: string, password: string): Promise<User> {
    try {
      // Hash password
      const hashedPassword = await argon2.hash(password, {
        type: argon2.argon2id,
        memoryCost: 2 ** 16,
        timeCost: 3,
        parallelism: 1,
      });

      // Create user
      const user = await this.userService.create({
        email,
        password: hashedPassword,
      });

      return user;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Registration failed', 500);
    }
  }

  /**
   * Login user
   */
  async login(email: string, password: string): Promise<User> {
    try {
      // Find user
      const user = await this.userService.findByEmail(email);
      if (!user) {
        throw new AppError('Invalid credentials', 401);
      }

      // Verify password
      const isValidPassword = await argon2.verify(user.password, password);
      if (!isValidPassword) {
        throw new AppError('Invalid credentials', 401);
      }

      return user;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Login failed', 500);
    }
  }

  /**
   * Generate JWT token
   */
  generateToken(user: User): string {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new AppError('JWT secret is not configured', 500);
    }

    const payload: JWTPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    return jwt.sign(payload, jwtSecret, {
      expiresIn: '1h',
      issuer: 'auth-service',
      audience: 'llm-aggregator',
    });
  }

  /**
   * Verify JWT token
   */
  verifyToken(token: string): JWTPayload {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new AppError('JWT secret is not configured', 500);
    }

    try {
      return jwt.verify(token, jwtSecret) as JWTPayload;
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        throw new AppError('Invalid token', 401);
      } else if (error instanceof jwt.TokenExpiredError) {
        throw new AppError('Token expired', 401);
      }
      throw new AppError('Token verification failed', 401);
    }
  }

  /**
   * Change password
   */
  async changePassword(userId: string, oldPassword: string, newPassword: string): Promise<void> {
    try {
      const user = await this.userService.findById(userId);
      if (!user) {
        throw new AppError('User not found', 404);
      }

      // Verify old password
      const isValidPassword = await argon2.verify(user.password, oldPassword);
      if (!isValidPassword) {
        throw new AppError('Invalid current password', 401);
      }

      // Hash new password
      const hashedPassword = await argon2.hash(newPassword, {
        type: argon2.argon2id,
        memoryCost: 2 ** 16,
        timeCost: 3,
        parallelism: 1,
      });

      // Update password
      await this.userService.update(userId, { password: hashedPassword });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Password change failed', 500);
    }
  }
}
