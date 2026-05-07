const authMiddleware = (req, res, next) => {
    // Mock extraction of user from headers
    const userId = req.headers['x-user-id'];
    const userRole = req.headers['x-user-role'];

    if (!userId || !userRole) {
        return res.status(401).json({ success: false, message: 'Unauthorized: Missing user headers' });
    }

    req.user = {
        id: userId,
        role: userRole
    };

    next();
};

module.exports = authMiddleware;
