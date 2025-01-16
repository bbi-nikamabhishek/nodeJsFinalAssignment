const BlogPost  = require('../models/BlogPost');
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Controller to handle adding a new blog
exports.addBlog = async (req, res) => {
  const { title, content, status } = req.body;
  const user = req.session.user;

  // Ensure the user is logged in
  if (!user) {
    return res.status(403).render('error-modal', {
      message: 'Access denied. Please log in to add a blog.',errorMessage: error.message
    });
  }

  try {
    // Create the new blog post
    await BlogPost.create({
      title,
      content,
      status,
      author_id: user.id,
    });

    // Redirect to the manage blogs page after successful addition
    res.redirect('/manage-blogs');
  } catch (error) {
    console.error('Error adding blog:', error);

    // Render an error page with a detailed message
    res.status(500).render('error-modal', {
      message: 'An error occurred while adding the blog. Please try again later.',errorMessage: error.message
    });
  }
};

// Controller to render the edit blog page
exports.getEditBlog = async (req, res) => {
    const user = req.session.user;
    const blogId = req.params.id;
  
    // Ensure the user is logged in
    if (!user) {
      return res.status(403).render('error-modalo', {
        message: 'Access denied. Please log in first.',errorMessage: error.message
      });
    }
  
    try {
      // Fetch the blog by its primary key
      const blog = await BlogPost.findByPk(blogId);
  
      // Check if the blog exists
      if (!blog) {
        return res.status(404).render('error-modal', {
          message: 'Blog not found.',errorMessage: error.message
        });
      }
  
      // Check if the user has permission to edit the blog
      if (blog.author_id !== user.id && user.role_id !== 1) {
        return res.status(403).render('error-modal', {
          message: 'Access denied. You cannot edit this blog.',errorMessage: error.message
        });
      }
  
      // Render the edit blog page
      res.render('edit-blog', { blog });
    } catch (error) {
      console.error('Error fetching blog:', error);
  
      // Render an error page with a detailed message
      res.status(500).render('error-modal', {
        message: 'An error occurred while fetching the blog. Please try again later.',errorMessage: error.message
      });
    }
  };

  exports.postEditBlog = async (req, res) => {
    const { title, content, status } = req.body;
    const user = req.session.user;
    const blogId = req.params.id;
  
    // Ensure the user is logged in
    if (!user) {
      return res.status(403).render('error-modal', {
        message: 'Access denied. Please log in first.',errorMessage: error.message
      });
    }
  
    try {
      // Fetch the blog by its primary key
      const blog = await BlogPost.findByPk(blogId);
  
      // Check if the blog exists
      if (!blog) {
        return res.status(404).render('error-modal', {
          message: 'Blog not found.',errorMessage: error.message
        });
      }
  
      // Ensure the user has permission to edit the blog
      if (blog.author_id !== user.id && user.role_id !== 1) {
        return res.status(403).render('error', {
          message: 'Access denied. You cannot edit this blog.',
        });
      }
  
      // Update the blog
      await blog.update({ title, content, status });
  
      // Redirect to the manage blogs page
      res.redirect('/manage-blogs');
    } catch (error) {
      console.error('Error updating blog:', error);
  
      // Render an error page with a detailed message
      res.status(500).render('error-modal', {
        message: 'An error occurred while updating the blog. Please try again later.',errorMessage: error.message
      });
    }
  };

  exports.deleteBlog = async (req, res) => {
    const { id } = req.params;
    const user = req.session.user;
  
    // Check if the user is logged in
    if (!user) {
      return res.redirect('/login?error=Please log in first');
    }
  
    try {
      // Fetch the blog post by ID
      const blog = await BlogPost.findByPk(id);
  
      // If the blog doesn't exist
      if (!blog) {
        return res.redirect('/manage-blogs?error=Blog not found');
      }
  
      // Check if the logged-in user has permission to delete the blog
      const isAdmin = user.role_id === 1; // Admin role
      const isAuthor = blog.author_id === user.id; // Author of the blog
  
      if (!isAdmin && !isAuthor) {
        return res.redirect('/manage-blogs?error=Access denied. You cannot delete this blog.');
      }
  
      // Delete the blog post
      await BlogPost.destroy({ where: { id } });
  
      // Redirect to the manage blogs page with a success message
      return res.redirect('/manage-blogs?success=Blog deleted successfully');
    } catch (error) {
      console.error('Error deleting blog:', error);
      return res.redirect('/manage-blogs?error=Server error. Please try again later.');
    }
  };

  exports.viewBlog = async (req, res) => {
    const blogId = req.params.id;
    const user = req.session.user;
  
    if (!user) {
      return res.redirect('/login?error=Please log in to view blogs.');
    }
  
    try {
      const blog = await BlogPost.findByPk(blogId);
      if (!blog) {
        return res.status(404).render('404', { title: 'Blog Not Found' });
      }
  
      res.render('view-blog', {
        title: blog.title,
        blog,
        user,
      });
    } catch (error) {
      console.error('Error fetching blog post:', error);
      res.status(500).send('An error occurred. Please try again later.');
    }
  };

  const genAI = new GoogleGenerativeAI("AIzaSyD-7kfIZKL20IDkWFH00yzwx66T9s076-4");
  
  exports.generateContent = async (req, res) => {
    const { lines, topic } = req.body;
  
    // Validate input
    if (!lines || isNaN(lines) || lines <= 0 || lines > 100) {
      return res.status(400).json({ error: 'Invalid number of lines specified. Please choose a number between 1 and 100.' });
    }
    if (!topic || typeof topic !== 'string' || topic.trim().length === 0) {
      return res.status(400).json({ error: 'Invalid or missing topic. Please provide a valid topic.' });
    }
  
    try {
      // Fetch the model
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  
      // Prepare the prompt with the topic
      const prompt = `Generate ${lines} lines of blog content about "${topic}". Ensure the content is written as a continuous paragraph without numbering and is highly relevant to the topic of "${topic}".`;
  
      // Generate content
      const result = await model.generateContent(prompt);
  
      // Debug the response structure
      console.log('AI Response:', JSON.stringify(result, null, 2));
  
      // Extract the content from `candidates`
      const content = result?.response?.candidates?.[0]?.content?.parts?.[0]?.text;
  
      // If no content is found, return an error
      if (!content) {
        return res.status(500).json({ error: 'No content received from the AI model.' });
      }
  
      // Remove any numbered lines or formatting issues, ensuring it's a single paragraph
      const paragraphContent = content.replace(/^\d+\.\s*/g, '').trim();
  
      res.json({ content: paragraphContent });
    } catch (error) {
      console.error('Error generating content:', error.message);
  
      // Handle specific errors
      if (error.response) {
        return res.status(error.response.status).json({
          error: error.response.data?.error?.message || 'Error from AI API.',
        });
      } else if (error.request) {
        return res.status(500).json({ error: 'Failed to connect to AI API.' });
      } else {
        return res.status(500).json({ error: 'Failed to generate content. Please try again.' });
      }
    }
  };
  