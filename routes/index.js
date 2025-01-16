const express = require('express');
const router = express.Router();  
const {renderLoginPage}=require('../controllers/home');
const { loginUser } = require('../controllers/loginController');
const { logoutUser } = require('../controllers/logoutController');
const { renderSignupPage,handleSignup } = require('../controllers/signupController');
const { renderDashboard } = require('../controllers/dashboardController');
const { renderManageUsers,deleteUser } = require('../controllers/manageUsersController');
const { getManageBlogs } = require('../controllers/manageBlogsController');
const { renderAddBlogPage } = require('../controllers/addBlogController');
const { addBlog,getEditBlog,postEditBlog,deleteBlog,viewBlog,generateContent} = require('../controllers/blogController');

router.get('/',renderLoginPage);

router.post('/login',loginUser);

router.get('/logout', logoutUser);

router.get('/signup', renderSignupPage);

router.post('/signup',handleSignup);

router.get('/dashboard',renderDashboard);

router.get('/manage-users', renderManageUsers);

router.post('/delete-user/:id', deleteUser);

router.get('/manage-blogs', getManageBlogs);

router.get('/add-blog', renderAddBlogPage);

router.post('/add-blog', addBlog);

router.get('/edit-blog/:id', getEditBlog);

router.post('/edit-blog/:id', postEditBlog);

router.get('/delete-blog/:id',deleteBlog );

router.get('/blogs/:id',viewBlog);

router.post('/generate-ai-content',generateContent);  

module.exports = router;
