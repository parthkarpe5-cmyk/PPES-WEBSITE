const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    // 1. Extract token — prefer Authorization header, fall back to cookie
    let token = null;

    const authHeader = req.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.slice(7);
    }

    // Fallback: read from cookie (sent by Next.js middleware)
    if (!token && req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please log in.'
      });
    }

    // 2. Verify signature
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error('[Auth] JWT_SECRET is not configured on the server!');
      return res.status(500).json({ success: false, message: 'Server misconfiguration.' });
    }

    const payload = jwt.verify(token, secret);

    // 3. Attach identity to request — same shape as before so controllers don't change
    req.user = {
      id: payload.userId || payload.id,
      role: payload.role,
      name: payload.name
    };

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Session expired. Please log in again.' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ success: false, message: 'Invalid token. Please log in again.' });
    }
    res.status(401).json({ success: false, message: 'Authentication failed.' });
  }
};

module.exports = authMiddleware;
