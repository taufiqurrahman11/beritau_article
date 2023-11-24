const { handleServerError } = require('../helpers/handleError');

const authorizeWriter = (req, res, next) => {
  try {
    const userRole = req.user.role;

    if (userRole !== 'writer') {
      return res.status(403).json({ error: 'Unauthorized, only writers can add articles' });
    }
    next();
  } catch (error) {
    return handleServerError(res);
  }
};

module.exports = authorizeWriter;
