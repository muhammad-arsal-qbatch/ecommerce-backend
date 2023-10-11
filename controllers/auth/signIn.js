import bcrypt from 'bcrypt';

import User from "../../models/userSchema";

const SignIn = async ({
  email,
  password
}) => {
  const user = await User.findOne({ email });

  if (user) {
     const value = await bcrypt.compare(password, user.password);
     if (value) {
      return { user };
     } else {
      return { message: 'User is not authorized' };
     }
  }
  
  return { message: 'Please create account first' };
};

export default SignIn;
