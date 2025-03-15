import jwt from 'jsonwebtoken';

// Get the secret key from environment variables
const getSecretKey = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.warn('JWT_SECRET not set in environment variables. Using fallback secret.');
    return 'fallback-secret-key-for-development';
  }
  return secret;
};

// Create a JWT token
export function signJwt(payload: any) {
  return jwt.sign(payload, getSecretKey(), { expiresIn: '7d' });
}

// Verify a JWT token
export function verifyJwt(token: string) {
  try {
    return jwt.verify(token, getSecretKey());
  } catch (error) {
    throw new Error('Invalid token');
  }
}
