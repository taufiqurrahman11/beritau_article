'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Bookmark extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Bookmark.belongsTo(models.User, {
        as: 'userBookmark',
        foreignKey: {
          name: 'userId',
        },
      });
      Bookmark.belongsTo(models.Article, {
        as: 'articleBookmark',
        foreignKey: {
          name: 'articleId',
        },
      });
    }
  }
  Bookmark.init(
    {
      userId: DataTypes.INTEGER,
      articleId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Bookmark',
    }
  );
  return Bookmark;
};
