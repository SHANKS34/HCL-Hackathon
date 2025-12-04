const jwt = require('jsonwebtoken');

// 1. Verify User is Logged In
const protect = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, role }
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// 2. Verify User is a Provider (Doctor)
const providerOnly = (req, res, next) => {
  if (req.user.role !== 'provider') {
    return res.status(403).json({ message: 'Access denied: Providers only' });
  }
  next();
};

// 3. Generic role-based guard
const restrictTo = (...roles) => {
  return (req, res, next) => {
    // req.user.role comes from the JWT payload
    if (!req.user || !roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: `Access denied: allowed roles: ${roles.join(', ')}` });
    }
    next();
  };
};

module.exports = { protect, providerOnly, restrictTo };
