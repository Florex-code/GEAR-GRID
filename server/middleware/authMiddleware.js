import jwt from 'jsonwebtoken';

const ADMIN_EMAIL = 'florexstudio.ng@gmail.com';
const isAdminEmail = (email) => email?.toLowerCase() === ADMIN_EMAIL;

export const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Not authorized, invalid token' });
  }
};

export const adminOnly = (req, res, next) => {
  if (!req.user?.isAdmin && !isAdminEmail(req.user?.email)) {
    return res.status(403).json({ message: 'Admin access only' });
  }
  next();
};
