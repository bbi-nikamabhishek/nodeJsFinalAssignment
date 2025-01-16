exports.renderLoginPage = async (req, res) => {
    try {
      // Render the login page (index.ejs)
      res.render('index');
    } catch (error) {
      console.error("Error rendering the login page:", error.message);
      res.status(500).render('error-modal', {
        message: "Internal Server Error. Please try again later.",
        errorMessage: error.message 
      });
    }
  };