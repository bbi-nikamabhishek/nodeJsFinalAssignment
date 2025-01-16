const sequelize = require('../config/database');
const User = require('./User');
const Role = require('./Role');
const BlogPost = require('./BlogPost');
const Permission = require('./Permission'); // Optional

// Associations
Role.hasMany(User, { foreignKey: 'role_id' });
User.belongsTo(Role, { foreignKey: 'role_id' });

User.hasMany(BlogPost, { foreignKey: 'author_id' });
BlogPost.belongsTo(User, { foreignKey: 'author_id' });

Role.hasMany(Permission, { foreignKey: 'role_id' }); // Optional
Permission.belongsTo(Role, { foreignKey: 'role_id' }); // Optional

// Sync models with the database
const initDatabase = async () => {
  try {
    await sequelize.sync({ force: false }); // Drops and recreates all tables
    console.log('Database synchronized!');

    // Insert initial data
    await Role.bulkCreate([
      { role_name: 'Admin' },
      { role_name: 'Editor' },
      { role_name: 'Viewer' },
    ]);

    console.log('Initial roles added!');
  } catch (error) {
    console.error('Error synchronizing database:', error);
  }
};

module.exports = {
  sequelize,
  User,
  Role,
  BlogPost,
  Permission,
  initDatabase,
};