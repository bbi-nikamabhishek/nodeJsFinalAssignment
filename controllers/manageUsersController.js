const  User  = require('../models/User');

// Controller for rendering the Manage Users page
exports.renderManageUsers = async (req, res) => {
  const user = req.session.user;

  // Check if user is logged in and is an Admin
  if (!user || user.role_id !== 1) {
    return res.status(403).render('error', { 
      message: 'Access denied. Only admins can access this page.' 
    });
  }

  try {
    // Fetch all users with specific attributes
    const users = await User.findAll({ attributes: ['id', 'username', 'email', 'role_id'] });

    // Render Manage Users page with user data
    res.render('manage-users', { users });
  } catch (error) {
    console.error('Error fetching users:', error);

    // Render error page with a descriptive message
    res.status(500).render('error', { 
      message: 'An error occurred while fetching user data. Please try again later.',error 
    });
  }
};


// Controller for deleting a user (Admin only)
exports.deleteUser = async (req, res) => {
  const user = req.session.user;

  // Check if user is logged in and is an Admin
  if (!user || user.role_id !== 1) {
    return res.status(403).render('error', {
      message: 'Access denied. Only admins can delete users.',
    });
  }

  try {
    const userId = parseInt(req.params.id, 10);

    // Prevent Admin from deleting themselves
    if (userId === user.id) {
      return res.status(400).render('error-modal', {
        message: 'You cannot delete yourself.',errorMessage: error.message
      });
    }

    // Check if the user exists before attempting to delete
    const userToDelete = await User.findByPk(userId);
    if (!userToDelete) {
      return res.status(404).render('error-modal', {
        message: 'User not found. Please try again.',errorMessage: error.message
      });
    }

    // Delete the user
    await User.destroy({ where: { id: userId } });

    // Redirect to the Manage Users page
    res.redirect('/manage-users');
  } catch (error) {
    console.error('Error deleting user:', error);

    // Render error page for server errors
    res.status(500).render('error-modal', {
      message: 'An error occurred while deleting the user. Please try again later.',errorMessage: error.message
    });
  }
};
