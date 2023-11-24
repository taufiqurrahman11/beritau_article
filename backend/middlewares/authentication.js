const { handleClientError } = require('../helpers/handleError');
const { verifyToken } = require('../helpers/jwt');

const authentication = (req, res, next) => {
  const bearerToken = req.headers.authorization;

  if (!bearerToken) {
    return handleClientError(res, 401, 'Authentication failed, you need token');
  }
  const token = bearerToken.replace('Bearer ', '');

  try {
    const decodedToken = verifyToken(token);
    req.user = decodedToken;
    console.log(req.user);
    next();
  } catch (error) {
    console.log(error)
    return res.status(403).json({ message: 'Invalid token', error: error.message });
  }
};

module.exports = authentication;
