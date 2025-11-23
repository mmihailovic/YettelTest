const dotenv = require('dotenv')
dotenv.config({ path: `.env.${process.env.NODE_ENV}` })

const app = require('./app');
const { sequelize } = require('./models');
const { User } = require("./models")

const PORT = process.env.PORT || 8080;

const startServer = async () => {
  try {
    // creating or updating tables
    await sequelize.sync({ alter: true });

    // seed users
    const admin = await User.findOne({ where: { username: 'admin' } })
    if (!admin) await User.create({ firstName: 'Admin', lastName: 'Admin', email: 'admin@email.com', username: 'admin', password: '$2a$12$rg9NwcHzEbTF/Qyib2XoZuJ1c5X5XDqjrUiMLLKPQwS75A1qfiJei', role: 'ADMIN' })
    const user = await User.findOne({ where: { username: 'user' } })
    if (!user) await User.create({ firstName: 'User', lastName: 'User', email: 'user@email.com', username: 'user', password: '$2a$12$rg9NwcHzEbTF/Qyib2XoZuJ1c5X5XDqjrUiMLLKPQwS75A1qfiJei', role: 'BASIC' })
    
    app.listen(PORT);

  } catch (err) {
    console.error(err);
  }
};

startServer();