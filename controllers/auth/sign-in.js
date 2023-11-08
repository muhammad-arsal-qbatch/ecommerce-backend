import bcrypt from 'bcrypt';

import User from '../../models/user';

const SignIn = async ({
    email,
    password
}) => {
  const foundUser = await User.findOne({ email });
  if(!foundUser)
    throw new Error('Please create account first' );

  if (foundUser) {
    const value = await bcrypt.compare(password, foundUser.password);
    if (value) {
      // foundUser.admin = foundUser.admin === 'present' ? foundUser.admin : 'absent';
      const user = { name: foundUser.name,
        email: foundUser.email,
        _id: foundUser._id,
        admin: foundUser.admin? foundUser.admin : false }
      return { user };
    } else {
      throw new Error('Invalid Credentials' );
    }
  }

};

export default SignIn;
