const app = require('./app');
const { sequelize } = require('./models');

const startServer = async () => {
  try {
    // creating or updating tables
    await sequelize.sync({ alter: true });

    app.listen(8080);

  } catch (err) {
    console.error(err);
  }
};

startServer();