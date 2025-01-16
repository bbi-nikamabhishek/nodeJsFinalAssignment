// Controller to render the Add Blog page
exports.renderAddBlogPage = (req, res) => {
    const user = req.session.user;
  
    // Check if the user is logged in
    if (!user) {
      return res.status(403).render('error-modal', {
        message: 'Access denied. Please log in to add a blog.', errorMessage: error.message 
      });
    }
  
    // Render the Add Blog page
    res.render('add-blog', { user });
  };
  