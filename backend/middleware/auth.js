const authMiddleware = (req, res, next) => {
  try {
    const userId = req.headers['x-user-id'];
    const userRole = req.headers['x-user-role'];

    if (!userId || !userRole) {
      return res.status(401).json({
        success: false,
        message: 'Missing authentication headers: x-user-id and x-user-role'
      });
    }

    req.user = {
      id: userId,
      role: userRole
    };

    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Authentication failed'
    });
  }
};

module.exports = authMiddleware;
