import GenerateToken from '../..//utils/generate-token';
import SendEmail from '../../utils/send-email';
import User from '../../models/user';

const ForgotPassword = async ({ email }) => {
  const user = await User.findOne({ email }); // no need to find user again
  if (!user) throw new Error('Account Not found');
  const token = await GenerateToken(email);
  const to = user.email;
  const subject = 'Password Reset Token';
  const text = `http://localhost:3000/auth/np?token=${token}`;
  await SendEmail(to, subject, text);

  return token;
};

export default ForgotPassword;
