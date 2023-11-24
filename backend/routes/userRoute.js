const express = require('express');
const { 
    getAllArticle, 
    getArticleById, 
    updateUser, 
    getProfile, 
    changePasswordToken,
    addToBookmarkToken,
    deleteFromBookmarkToken,
    getAllBookmarkToken} = require('../controllers/userController');
const authentication = require('../middlewares/authentication');
const router = express.Router();

router.get('/article', getAllArticle);
router.get('/article/:articleId', getArticleById);

router.use(authentication);
router.get('/getProfile', getProfile)
router.put('/password', changePasswordToken)

router.get('/bookmark', getAllBookmarkToken)
router.post('/bookmark/:articleId', addToBookmarkToken)
router.delete('/bookmark/:articleId', deleteFromBookmarkToken)
// router.get('/:userId', getUserById);

router.put('/:userId', updateUser);


module.exports = router;
