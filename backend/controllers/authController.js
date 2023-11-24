const { comparePassword } = require('../helpers/crypto');
const { generateRandomPassword, sendMail, resetPasswordMessage } = require('../helpers/forgotPassword');
const { handleServerError, handleClientError } = require('../helpers/handleError');
const { generateToken } = require('../helpers/jwt');
const { User } = require('../models');
const Joi = require('joi');

exports.register = async (req, res) => {
  try {
    const { fullName, password, email, phone, role } = req.body;

    const userSchema = Joi.object({
      fullName: Joi.string().required(),
      password: Joi.string().required(),
      email: Joi.string().email().required(),
      phone: Joi.string().required(),
      role: Joi.string().required(),
    });
    const { error } = userSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        status: 'Validation Failed',
        message: error.details[0].message,
      });
    }

    const existingPhone = await User.findOne({
      where: {
        phone: phone,
      },
    });
    console.log(existingPhone);

    if (existingPhone) {
      return handleClientError(res, 400, 'Phone number already exists');
    }

    const existingUser = await User.findOne({
      where: {
        email: email,
      },
    });
    if (existingUser) {
      return handleClientError(res, 400, 'Email has already exists');
    }

    const verificationToken = generateToken();

    const newUser = await User.create(
      {
        fullName,
        password,
        email,
        phone,
        role,
        isVerified: false,
        tokenVerified: verificationToken,
      },
      {
        attributes: {
          exclude: ['createdAt', 'updatedAt'],
        },
      }
    );

    const verificationLink = `http://localhost:3001/api/verify/${verificationToken}`; // Ganti dengan URL frontend Anda
    const mailSubject = 'Email Verification';
    const mailContent = `Click <a href="${verificationLink}">here</a> to verify your email.`;

    await sendMail(email, mailSubject, mailContent);

    res.status(201).json({ data: newUser, message: 'User created successfully' });
  } catch (error) {
    console.log(error);
    return handleServerError(res);
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({ where: { tokenVerified: token } });

    if (!user) {
      return res.status(404).json({ message: 'Invalid token or user not found' });
    }
    user.isVerified = true;
    user.tokenVerified = null;
    await user.save();
    res.redirect('http://localhost:3000/verify-success');
  } catch (error) {
    console.error(error);
    return handleServerError(res)
  }
};

exports.login = async (req, res) => {
  try {
    const { password, email } = req.body;

    const userSchema = Joi.object({
      password: Joi.string().required(),
      email: Joi.string().email().required(),
    });

    const { error } = userSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        status: 'Validation Failed',
        message: error.details[0].message,
      });
    }

    const user = await User.findOne({
      where: {
        email: email,
      },
    });

    const passwordMatch = comparePassword(password, user.password);

    if (!passwordMatch) {
      return handleClientError(res, 401, 'Invalid email or password');
    }

    if (!user.isVerified) {
      return handleClientError(res, 401, 'Account not verified');
    }

    const token = generateToken(user.id, user.role);

    const dataResponse = {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      role: user.role,
    };

    res.status(200).json({
      token: token,
      message: 'Login successful',
      data: dataResponse,
    });
  } catch (error) {
    console.log(error);
    return handleServerError(res);
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({
      where: {
        email: email,
      },
    });

    if (!user) {
      return handleClientError(res, 404, 'User not found');
    }

    const randomPassword = generateRandomPassword();
    const hashed = hashingPassword(randomPassword);

    user.password = hashed;
    await user.save();

    const message = resetPasswordMessage(user.name, randomPassword);

    await sendMail(email, 'Forgot Password', message);

    res.status(200).json({ message: 'Reset password email sent successfully' });
  } catch (error) {
    console.log(error);
    return handleServerError(res);
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({
      where: {
        email: email,
      },
    });

    if (!user) {
      return handleClientError(res, 404, 'User not found');
    }

    const randomPassword = generateRandomPassword();
    const hashed = hashingPassword(randomPassword);

    user.password = hashed;
    await user.save();

    const message = resetPasswordMessage(user.name, randomPassword);

    await sendMail(email, 'Forgot Password', message);

    res.status(200).json({ message: 'Reset password email sent successfully' });
  } catch (error) {
    console.log(error);
    return handleServerError(res);
  }
};
