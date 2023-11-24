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
      html: html
    };

    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    throw new Error('Failed to send email');
  }
};

module.exports = {
  sendMail,
};
