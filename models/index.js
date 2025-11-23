const { Sequelize } = require('sequelize');
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  { host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT,
    logging: false 
  }
)

const User = require('./user.model')(sequelize)
const Task = require('./task.model')(sequelize);

User.hasMany(Task)
Task.belongsTo(User)

module.exports = {
  sequelize,
  User,
  Task
};