// Controller for handling logout
exports.logoutUser = (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error('Session destruction error:', err);
        return res.status(500).send('Error logging out, please try again later');
      }
      res.redirect('/'); 
    });
  };
  