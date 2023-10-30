import nodemailer from 'nodemailer';

import { emailSendPassword, emailSendUser } from '../config/config';

const SendEmail = async (to, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: emailSendUser,
        pass: emailSendPassword,
      },
    });

    const info = await transporter.sendMail({
      from: emailSendUser,
      to,
      subject,
      text,
    });

    console.log('Message sent: %s', info.messageId);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

export default SendEmail;