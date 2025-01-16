const session = require('express-session');

const sessionConfig = {
  secret: 'your_secret_key', // Make sure to use a more secure key in production
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // 1 day
    httpOnly: true,  // Make sure the cookie can't be accessed via JavaScript
    secure: false,   // Set to true if using HTTPS
    sameSite: 'strict',  // Optional but helps with cross-origin requests
  },
};


module.exports = sessionConfig;
