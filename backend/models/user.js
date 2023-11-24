'use strict';
const { Model } = require('sequelize');
const { hashingPassword } = require('../helpers/crypto');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Article, {
        foreignKey: 'userId',
      });
      User.hasMany(models.Bookmark, {
        as: 'userBookmark',
        foreignKey: {
          name: 'userId',
        },
      });
    }
  }
  User.init(
    {
      fullName: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      phone: DataTypes.STRING,
      isVerified: DataTypes.BOOLEAN,
      tokenVerified: DataTypes.STRING,
      role: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'User',
      hooks: {
        beforeCreate: (user) => {
          if (user.password) {
            user.password = hashingPassword(user.password);
          }
        },
      },
    }
  );
  return User;
};
