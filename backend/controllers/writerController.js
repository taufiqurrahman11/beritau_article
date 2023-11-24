const { handleServerError, handleClientError } = require('../helpers/handleError');
const client = require('../helpers/redis');
const { Article, User } = require('../models');
const Joi = require('joi');

exports.createArticleToken = async (req, res) => {
  try {
    const { category, title, description, date } = req.body;

    const imagePath = req.file.path.replace(/\\/g, '/');
    const newImage = `http://localhost:3001/${imagePath}`;

    const userId = req.user.id;
    const user = await User.findByPk(userId);

    const articleSchema = Joi.object({
      category: Joi.string().required(),
      title: Joi.string().required(),
      description: Joi.string().required(),
      date: Joi.string()
    });

    const { error } = articleSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const newArticle = await Article.create({
      category,
      title,
      description,
      author: user.fullName,
      date,
      photoArticle: newImage,
      userId,
    });

    const cacheExists = await client.exists('allArticle');
    if (cacheExists) {
      await client.del('allArticle');
      console.log('Cache cleared successfully');
    }

    await newArticle.save();

    return res.status(201).json({ data: newArticle, message: 'Article added successfully' });
  } catch (error) {
    console.log(error);
    return handleServerError(res);
  }
};

exports.updateArticle = async (req, res) => {
  try {
    const { userId, articleId } = req.params;


    const articleToUpdate = await Article.findOne({
      where: { id: articleId, userId: userId },
    });

    if (!articleToUpdate) {
      return res.status(404).json({ message: 'Article not found' });
    }

    const authenticatedUserId = req.user.id;
    if (parseInt(userId) !== authenticatedUserId) {
      return res.status(403).json({ message: 'Forbidden, you can only update your own articles' });
    }

    const articleSchema = Joi.object({
      title: Joi.string(),
      description: Joi.string(),
      date: Joi.string(),
    });

    const { error } = articleSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { title, description, date } = req.body;
    const imagePath = req.file ? req.file.path.replace(/\\/g, '/') : null;

    if (imagePath) {
      const newImage = `http://localhost:3001/${imagePath}`;
      articleToUpdate.photoArticle = newImage;
    }

    articleToUpdate.title = title;
    articleToUpdate.description = description;
    articleToUpdate.date = date;

    await articleToUpdate.save();

    return res.status(200).json({ data: articleToUpdate, message: 'Article updated successfully' });
  } catch (error) {
    return handleServerError(res);
  }
};


exports.deleteArticleToken = async (req, res) => {
  try {
    const userId = req.user.id;
    const { articleId } = req.params;

    const articleToDelete = await Article.findOne({
      where: { id: articleId, userId: userId },
    });

    if (!articleToDelete) {
      return res.status(404).json({ message: 'Article not found' });
    }

    await articleToDelete.destroy();

    const cacheExists = await client.exists('allArticle');
    if (cacheExists) {
      await client.del('allArticle');
      console.log('Cache allArticle cleared successfully');
    }

    return res.status(200).json({ message: 'Article deleted successfully' });
  } catch (error) {
    return handleServerError(res);
  }
};