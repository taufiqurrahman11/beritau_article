const express = require('express');
const { updateArticle, createArticleToken, deleteArticleToken } = require('../controllers/writerController');
const authentication = require('../middlewares/authentication');
const authorizeWriter = require('../middlewares/authorizeWriter');
const upload = require('../middlewares/multer');
const router = express.Router();

router.use(authentication);
router.use(authorizeWriter);

router.post('/article', upload.single('photoArticle'), createArticleToken)
router.delete('/article/:articleId', deleteArticleToken)

router.put('/:userId/article/:articleId', upload.single('photoArticle'), updateArticle);

module.exports = router;
