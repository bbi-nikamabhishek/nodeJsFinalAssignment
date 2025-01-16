const bcrypt=require('bcryptjs');
const User  = require('../models/User');
// Controller for rendering the sign-up page
exports.renderSignupPage = (req, res) => {
    try {
      // Render the sign-up page (signup.ejs)
      res.render('signup');
    } catch (error) {
      console.error('Error rendering sign-up page:', error);
      res.status(500).render('error-modal', {
        message: 'Internal Server Error. Please try again later.',
        errorMessage: error.message
      });
    }
  };

  exports.handleSignup = async (req, res) => {
    const { username, email, password, role_id = 3 } = req.body; // Default to Viewer role if none is provided
  
    // Validate required fields
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Username, email, and password are required' });
    }
  
    try {
      // Check if user already exists
      const existingUser = await User.findOne({ where: { username } });
      if (existingUser) {
        return res.status(400).json({ error: 'Username already taken' });
      }
  
      // Hash the password securely
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create the new user
      await User.create({ username, email, password: hashedPassword, role_id });
  
      // Successful sign-up, render success page
      res.render('signup-success');
    } catch (error) {
      console.error('Sign-up error:', error);
      // Server error response
      res.status(500).json({ error: 'Server error, please try again later' });
    }
  };
  