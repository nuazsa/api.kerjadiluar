import jwt, { JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string;

if (!JWT_SECRET) {
  throw new Error('FATAL ERROR: JWT_SECRET tidak diatur di environment variables.');
}

/**
 * Generate a JWT token for a user session.
 */
export function generateAuthToken(sessionId: string): string {
  const payload = { sessionId };
  // Sesuaikan masa berlaku token sesuai kebutuhan
  const expiresIn = '7d';

  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

/**
 * Verify and decode a JWT token.
 */
export function verifyToken(token: string): JwtPayload {
  const decoded = jwt.verify(token, JWT_SECRET);

  if (typeof decoded === 'string') {
    throw new Error('Token tidak valid');
  }

  return decoded;
}