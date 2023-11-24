const nodemailer = require('nodemailer');
const email = process.env.EMAIL;
const password = process.env.PASSWORD;

const sendMail = async (to, subject, html) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: email,
        pass: password,
      },
    });

    const mailOptions = {
      from: email,
      to: to,
      subject: subject,
      html: html,
    };

    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    throw new Error('Failed to send email');
  }
};

const generateRandomPassword = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let randomPassword = '';
  const passwordLength = 8;

  for (let i = 0; i < passwordLength; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomPassword += characters.charAt(randomIndex);
  }

  return randomPassword;
};

const resetPasswordMessage = (name, randomPassword) => `
  <html>
    <body>
      <h2>Password Reset</h2>
      <p>Hello ${name},</p>
      <p>Your password has been reset successfully.</p>
      <p>Your new password is: <strong>${randomPassword}</strong></p>
      <p>Please login with this password and change it immediately after login.</p>
      <p>Best regards,<br/>Taufiq - Phincon</p>
    </body>
  </html>
`;

module.exports = { sendMail, generateRandomPassword, resetPasswordMessage };
