const bcrypt = require('bcryptjs');
const User = require('../models/User'); // Adjust based on your actual model path

// Controller for handling login
exports.loginUser = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send('Username and password are required');
  }

  try {
    // Attempt to find the user by username
    const user = await User.findOne({ where: { username } });

    if (!user) {
      return res.status(401).send('Invalid username or password');
    }

    // Validate the password using bcrypt
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).send('Invalid username or password');
    }

    // Store user info in session
    req.session.user = {
      id: user.id,
      username: user.username,
      role_id: user.role_id
    };

    req.session.save((err) => {
      if (err) {
        console.error('Session save error:', err);
        return res.status(500).send('Error saving session');
      }
      return res.redirect('/dashboard');
    });

  } catch (error) {
    console.error('Login error:', error);
    // Centralized error handling for any unexpected server issues
    res.status(500).send('Server error, please try again later');
  }
};
