const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('postgres://postgres:123@localhost:5432/yettel')
const User = require('./user.model')(sequelize)
const Task = require('./task.model')(sequelize);

User.hasMany(Task)
Task.belongsTo(User)

module.exports = {
  sequelize,
  User,
  Task
};