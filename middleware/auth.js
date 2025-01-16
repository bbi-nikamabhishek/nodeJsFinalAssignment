const { User } = require('../models/User');

// Middleware to check if user is authenticated
const isAuthenticated = async (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }

  try {
    const user = await User.findByPk(req.session.user.id);
    if (!user) {
      return res.redirect('/login');
    }
    req.user = user; // Attach user to the request object
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.redirect('/login');
  }
};

// Middleware to check user roles
const hasRole = (role) => {
  return (req, res, next) => {
    if (req.user.role_id !== role) {
      return res.status(403).send('Forbidden');
    }
    next();
  };
};

module.exports = { isAuthenticated, hasRole };
