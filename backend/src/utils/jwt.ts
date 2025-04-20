import jwt from 'jsonwebtoken';

interface JwtPayload {
  id: string;
  iat?: number;
  exp?: number;
}

/**
 * Generate a JWT token for a user
 * @param userId The user ID to encode in the token
 * @returns JWT token string
 */
export function generateToken(userId: string): string {
  const secret = process.env.JWT_SECRET;
  
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is not set');
  }
  
  return jwt.sign(
    { id: userId }, 
    secret
  );
}

/**
 * Verify a JWT token
 * @param token The token to verify
 * @returns Decoded token payload
 */
export function verifyToken(token: string): JwtPayload {
  const secret = process.env.JWT_SECRET;
  
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is not set');
  }
  
  try {
    const decoded = jwt.verify(token, secret) as JwtPayload;
    return decoded;
  } catch (error) {
    throw error;
  }
} 