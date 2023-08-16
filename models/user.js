const { Sequelize, DataTypes } = require('sequelize');

var sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'db/poochie-pals.db'
});
const User = sequelize.define('User', {
  full_name: DataTypes.STRING,
  username: DataTypes.STRING,
  email: DataTypes.STRING,
  user_type: DataTypes.STRING,
  pet_name: DataTypes.STRING,
  password: DataTypes.STRING
});

module.exports = { User, sequelize };
