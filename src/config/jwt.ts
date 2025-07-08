export const jwtConfig = {
  secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
  expiresIn: '1h',
  issuer: 'auth-service',
  audience: 'llm-aggregator',
  algorithm: 'HS256' as const,
};

export const cookieConfig = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  maxAge: 60 * 60 * 1000, // 1 hour in milliseconds
};

export const validateJWTSecret = (): void => {
  if (!process.env.JWT_SECRET) {
    console.error('❌ JWT_SECRET environment variable is required');
    process.exit(1);
  }
  
  if (process.env.JWT_SECRET.length < 32) {
    console.error('❌ JWT_SECRET must be at least 32 characters long');
    process.exit(1);
  }
};
