import User from '../../models/userSchema';

import { hashPassword } from '../../middlewares/auth';

const SignUp = async ({
  name,
  email, 
  password,
  mobileNo
}) => {
  const user = await User.findOne({ email });

  if (!user) {
    const hashedPassword = await hashPassword(password); // h should be capital
    const newUser = new User({
    name,
    email,
    password: hashedPassword,
    mobileNo
  });

  newUser.save();

  return { user: newUser };  
  }

  return { message: 'user with this email already exist, please use different email' };
};

export default SignUp;
