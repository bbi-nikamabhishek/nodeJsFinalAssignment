const express = require('express');
const app = express();
const session = require('express-session');
const { initDatabase } = require('./models/index');
const sessionConfig = require('./config/session');
const authRoutes = require('./routes/index');
const { request } = require('http');
// const { isAuthenticated, hasRole } = require('./middleware/auth');
app.use(session(sessionConfig));


// Setup view engine (EJS, Pug, or another templating engine)
app.set('view engine', 'ejs'); // Example with EJS
app.set('views', './views');

// Middleware setup
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// Routes
app.use(authRoutes);

// // Protected routes example
// app.get('/dashboard', isAuthenticated, (req, res) => {
//   res.render('dashboard', { user: req.user });
// });

// app.get('/admin', isAuthenticated, hasRole(1), (req, res) => { // 1 = Admin role
//   res.render('admin-dashboard');
// });

// Initialize database
initDatabase();

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000/');
});
