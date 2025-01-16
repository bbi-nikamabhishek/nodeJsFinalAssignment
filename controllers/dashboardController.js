const { User, BlogPost } = require('../models'); // Import models
const { Op } = require('sequelize'); // Sequelize operators

// Controller for rendering dashboard
exports.renderDashboard = async (req, res) => {
  const user = req.session.user;

  if (!user) {
    return res.redirect('/'); // Redirect to login page if no user in session
  }

  try {
    let data = {};

    // Fetch data based on user role
    if (user.role_id === 1) {
      // Admin: Can manage all users and blogs
      data.users = await User.findAll();
      data.blogs = await BlogPost.findAll();
    } else if (user.role_id === 2) {
      // Editor: Can manage their own blogs (drafts or published) and all published blogs
      data.blogs = await BlogPost.findAll({ 
        where: { 
          [Op.or]: [
            { author_id: user.id }, // Editor's own blogs
            { status: 'Published' }  // All published blogs
          ]
        } 
      });
    } else if (user.role_id === 3) {
      // Viewer: Can only view published blogs
      data.blogs = await BlogPost.findAll({ where: { status: 'Published' } });
    }

    // Render dashboard page with user data and relevant blog information
    res.render('dashboard', { user, data });

  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).render('error-modal', { message: 'Server error. Please try again later.', errorMessage: error.message });
  }
};
