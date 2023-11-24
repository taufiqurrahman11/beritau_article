const bcrypt = require('bcryptjs');

const hashingPassword = (password) => {
  try {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    return hash;
  } catch (error) {
    throw new Error('Hashing failed', error);
  }
};

const comparePassword = (inputPassword, hashedPassword) => {
  try {
    const matched = bcrypt.compareSync(inputPassword, hashedPassword);
    return matched;
  } catch (error) {
    throw new Error('Comparison failed', error);
  }
};

module.exports = { hashingPassword, comparePassword };
