'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Article extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Article.belongsTo(models.User, {
        foreignKey: 'userId',
      });
      Article.hasMany(models.Bookmark, {
        as: 'articleBookmark',
        foreignKey: {
          name: 'articleId',
        },
      });
    }
  }
  Article.init(
    {
      category: DataTypes.STRING,
      title: DataTypes.STRING,
      description: DataTypes.TEXT,
      author: DataTypes.STRING,
      date: DataTypes.STRING,
      photoArticle: DataTypes.STRING,
      userId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Article',
    }
  );
  return Article;
};
