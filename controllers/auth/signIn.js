import bcrypt from 'bcrypt';

import User from '../../models/userSchema';

const SignIn = async ({
    email,
    password
}) => {
    const user = await User.findOne({ email });
    console.log('user is, ', user.name);

    if(user.name === 'admin' )
    {
        console.log('user is, ', password);

        if(user.password === password)
        {
            console.log('it is amdin');
            return { user }
        }
    }

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
