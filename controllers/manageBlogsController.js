const { BlogPost, User } = require('../models');
const { Op } = require('sequelize');

// Controller for managing blogs
exports.getManageBlogs = async (req, res) => {
  const user = req.session.user;

  // Check if the user is logged in
  if (!user) {
    return res.status(403).render('error', {
      message: 'Access denied. Please log in first.',
    });
  }

  try {
    let blogs;

    // Fetch blogs based on user role
    if (user.role_id === 1) {
      // Admin: Can manage all blogs
      blogs = await BlogPost.findAll({
        include: [{ model: User, attributes: ['username'] }],
        attributes: ['id', 'title', 'content', 'status', 'createdAt'],
      });
    } else if (user.role_id === 2) {
      // Editor: Can only manage their own drafts and published blogs
      blogs = await BlogPost.findAll({
        where: {
          author_id: user.id, // Only the editor's blogs
          [Op.or]: [{ status: 'Draft' }, { status: 'Published' }], // Drafts and published
        },
        include: [{ model: User, attributes: ['username'] }],
        attributes: ['id', 'title', 'content', 'status', 'createdAt'],
      });
    } else {
      return res.status(403).render('error-modal', {
        message: 'Access denied. Viewers cannot manage blogs.',errorMessage: error.message
      });
    }

    // Render the manage-blogs page
    res.render('manage-blogs', { blogs, user });
  } catch (error) {
    console.error('Error fetching blogs:', error);

    // Render an error page for server errors
    res.status(500).render('error-modal', {
      message: 'An error occurred while fetching blogs. Please try again later.',errorMessage: error.message
    });
  }
};
