const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  try {
    // Check httpOnly cookie first, then Authorization header (Bearer token)
    let token = req.cookies?.adminToken;

    if (!token && req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ error: 'Not authorized. Please log in.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.adminId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token invalid or expired. Please log in again.' });
  }
};

module.exports = protect;
