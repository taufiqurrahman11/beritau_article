const { comparePassword, hashingPassword } = require('../helpers/crypto');
const { handleServerError, handleClientError } = require('../helpers/handleError');
const client = require('../helpers/redis');
const { Article, User, Bookmark } = require('../models');

exports.getAllArticle = async (req, res) => {
  const redisKey = 'allArticle';

  try {
      const cachedArticle = await client.get(redisKey);

      if (cachedArticle) {
          return res.status(200).json({ message: 'caching redis', data: JSON.parse(cachedArticle) });
      } else {
          const articles = await Article.findAll({
            attributes: { exclude: ['createdAt', 'updatedAt'] }
          });
          await client.set(redisKey, JSON.stringify(articles), {
              EX: 3600
          });

          return res.status(200).json({ message: 'Success', data: articles });
      }
  } catch (error) {
      console.error('Error fetching articles:', error);
      return res.status(500).json({ message: 'Internal server error: ' + error });
  }
};

exports.getArticleById = async (req, res) => {
  try {
    const articleId = req.params.articleId;

    const article = await Article.findByPk(articleId, {
      attributes: { exclude: ['createdAt', 'updatedAt'] },
    });

    if (!article) {
      return handleClientError(res, 404, 'Article not found');
    }

    return res.status(200).json({ data: article, message: 'Successfully get article by Id' });
  } catch (error) {
    return handleServerError(res);
  }
};

exports.getUserById = async (req, res) => {
  try {
    const userId = req.params.userId;

    if (userId && req.user.id !== parseInt(userId)) {
      return handleClientError(res, 403, 'Forbidden, you can only access your own data');
    }

    const user = await User.findOne({
      where: { id: userId },
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      include: [
        {
          model: Article,
          attributes: { exclude: ['createdAt', 'updatedAt'] },
        },
        {
          model: Bookmark,
          as: 'userBookmark',
          include: {
            model: Article,
            as: 'articleBookmark',
            attributes: { exclude: ['createdAt', 'updatedAt'] },
          },
        },
      ],
    });

    if (!user) {
      return handleClientError(res, 404, 'User not found');
    }

    return res.status(200).json({ data: user, message: 'Successfully get user by Id with articles' });
  } catch (error) {
    console.log(error);
    return handleServerError(res);
  }
};

exports.getProfile = async (req, res) =>{
  try {
    const userId = req.user.id;

    const user = await User.findOne({
      where: { id: userId },
      attributes: { exclude: ['createdAt', 'updatedAt', 'password'] },
      include: [
        {
          model: Article,
          attributes: { exclude: ['createdAt', 'updatedAt'] },
        },
        {
          model: Bookmark,
          as: 'userBookmark',
          include: {
            model: Article,
            as: 'articleBookmark',
            attributes: { exclude: ['createdAt', 'updatedAt'] },
          },
        },
      ],
    });

    if (!user) {
      return handleClientError(res, 404, 'User not found');
    }

    return res.status(200).json({ data: user, message: 'Successfully get user by Id with articles' });
  } catch (error) {
    return handleServerError(res)
  }
}

exports.updateUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { fullName, email, phone, role } = req.body;

    if (userId && req.user.id !== parseInt(userId)) {
      return handleClientError(res, 403, 'Forbidden, you can only access your own data');
    }

    const user = await User.findByPk(userId);

    if (!user) {
      return handleClientError(res, 404, 'User not found');
    }

    user.fullName = fullName || user.fullName;
    user.email = email || user.email;
    user.phone = phone || user.phone;
    user.role = role || user.role;

    await user.save();

    return res.status(200).json({ data: user, message: 'User updated successfully' });
  } catch (error) {
    return handleServerError(res);
  }
};

exports.changePasswordToken = async (req, res) => {
  try {
    const userId = req.user.id;
    const { oldPassword, newPassword } = req.body;

    const user = await User.findByPk(userId);
    if (!user) {
      return handleClientError(res, 404, 'User not found');
    }

    const passwordMatch = comparePassword(oldPassword, user.password);
    if (!passwordMatch) {
      return handleClientError(res, 401, 'Invalid old password');
    }

    user.password = hashingPassword(newPassword);
    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.log(error);
    return handleServerError(res);
  }
};

exports.getAllBookmarkToken = async (req, res) => {
  const redisKey = 'allBookmark'; 

  try {
      const cachedBookmark = await client.get(redisKey);

      if (cachedBookmark) {
        return res.status(200).json({ message: 'caching redis', data: JSON.parse(cachedBookmark) });
      } else {
        const userId = req.user.id;

        const user = await User.findOne({
          where: { id: userId },
          attributes: { exclude: ['createdAt', 'updatedAt', 'password'] },
          include: {
            model: Bookmark,
            as: 'userBookmark',
            attributes: { exclude: ['createdAt', 'updatedAt'] },
            include: {
              model: Article,
              as: 'articleBookmark',
              attributes: { exclude: ['createdAt', 'updatedAt'] },
            },
          },
        });

        await client.set(redisKey, JSON.stringify(user), {
          EX: 3600
        });

        return res.status(200).json({ message: 'Success', data: user.userBookmark });
      }
  } catch (error) {
      console.log('Error fetching articles:', error);
      return res.status(500).json({ message: 'Internal server error: ' + error });
  }
};


exports.addToBookmarkToken = async (req, res) => {
  try {
    const userId = req.user.id;
    const {articleId} = req.params;

    const user = await User.findByPk(userId);
    const article = await Article.findByPk(articleId, {
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      include: [
        {
          model: Bookmark,
          as: 'articleBookmark',
          attributes: { exclude: ['createdAt', 'updatedAt'] },
        },
      ],
    });

    if (!article) {
      return handleClientError(res, 404, 'Article not found');
    }

    const existingBookmark = await Bookmark.findOne({
      where: {
        userId: userId,
        articleId: articleId,
      },
    });

    if (existingBookmark) {
      return handleClientError(res, 400, 'Article already bookmarked');
    }

    const newBookmark = await Bookmark.create({
      userId: userId,
      articleId: articleId,
    });

    const cacheExists = await client.exists('allBookmark');
    if (cacheExists) {
      await client.del('allBookmark');
      console.log('Cache allBookmark cleared successfully');
    }

    return res.status(201).json({ data: article, message: 'Article bookmarked successfully' });
  } catch (error) {
    return handleServerError(res);
  }
};


exports.deleteFromBookmarkToken = async (req, res) => {
  try {
    const userId = req.user.id;
    const {articleId} = req.params;
    
    const user = await User.findByPk(userId);
    const article = await Article.findByPk(articleId);

    if (!user) {
      return handleClientError(res, 404, 'User not found');
    }

    if (!article) {
      return handleClientError(res, 404, 'Article not found');
    }

    const existingBookmark = await Bookmark.findOne({
      where: {
        userId: userId,
        articleId: articleId,
      },
    });

    if (!existingBookmark) {
      return handleClientError(res, 404, 'Bookmark not found');
    }

    await existingBookmark.destroy();

    const cacheExists = await client.exists('allBookmark');
    if (cacheExists) {
      await client.del('allBookmark');
      console.log('Cache allBookmark cleared successfully');
    }

    return res.status(200).json({ data: {}, message: 'Bookmark removed successfully' });
  } catch (error) {
    return handleServerError(res);
  }
};
