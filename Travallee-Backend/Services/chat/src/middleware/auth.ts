import jwt from 'jsonwebtoken';

export interface DecodedToken {
  id: string;
  role: string;
  iat: number;
  exp: number;
}

export const authMiddleware = (token: string): DecodedToken => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
    return decoded;
  } catch (error) {
    throw new Error('Invalid token');
  }
};

export const verifyToken = (token: string): DecodedToken | null => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
    return decoded;
  } catch (error) {
    return null;
  }
};
