// import bcrypt from 'bcrypt';

import User from '../../models/user';
import { GenerateToken } from '../../middlewares/auth';
const nodemailer = require('nodemailer');

const ForgotPassword = async ({
    email
}) => {
    console.log('insie fianl');
    const user = await User.findOne({ email });
    if(!user)
        throw new Error('Account Not found' );
    const token = await GenerateToken(email);
    const to = user.email;
    const subject = 'Password Reset Token';
    const text = `http://localhost:3000/np?token=${token}`;

    await sendEmail(to, subject, text);



};



const sendEmail = async (to, subject, text) => {
    try {
    // create reusable transporter object using the default SMTP transport
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: 'muhammadarsal236@gmail.com',
                pass: 'etow excw lqel ajnr'
            }
        });

        // send mail with defined transport object
        const info = await transporter.sendMail({
            from: 'muhammadarsal236@gmail.com', // sender address
            to,
            subject, // Subject line
            text // plain text body
        });

        console.log('Message sent: %s', info.messageId);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

// Example usage
// sendEmail('recipient@example.com', 'Test Subject', 'Hello, this is a test email.');


export default ForgotPassword;
