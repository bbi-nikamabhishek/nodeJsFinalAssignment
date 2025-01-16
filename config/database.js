const { Sequelize } = require('sequelize');

// Create Sequelize instance
const sequelize = new Sequelize('blog_management', 'root', 'root', {
  host: 'localhost',
  dialect: 'mysql',
  port: 8889
  // logging: console.log, // Enable logging for dev env
});

module.exports = sequelize;
