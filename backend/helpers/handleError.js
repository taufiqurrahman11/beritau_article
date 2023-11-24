const handleServerError = (res) => {
  return res.status(500).json({ message: 'Internal server error' });
};

const handleClientError = (res, status, message) => {
  return res.status(status).json({ message });
};

module.exports = {
  handleClientError,
  handleServerError,
};
