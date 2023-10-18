import { GenerateToken } from '../../middlewares/auth';
import nodemailer from 'nodemailer';

import User from '../../models/user';

const ForgotPassword = async ({ email }) => {
    const user = await User.findOne({ email });
    if (!user) throw new Error('Account Not found');
    const token = await GenerateToken(email);
    const to = user.email;
    const subject = 'Password Reset Token';
    const text = `http://localhost:3000/np?token=${token}`;

    await sendEmail(to, subject, text);
};

const sendEmail = async (to, subject, text) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: 'muhammadarsal236@gmail.com',
                pass: 'etow excw lqel ajnr',
            },
        });

        const info = await transporter.sendMail({
            from: 'muhammadarsal236@gmail.com',
            to,
            subject,
            text,
        });

        console.log('Message sent: %s', info.messageId);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

export default ForgotPassword;
