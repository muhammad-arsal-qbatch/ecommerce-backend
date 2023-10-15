import bcrypt from 'bcrypt';

import User from '../../models/user';

const SignIn = async ({
    email,
    password
}) => {
    const user = await User.findOne({ email });
    if(!user)
        throw new Error('Please create account first' );

    if(user.name === 'admin' )
    {
        if(user.password === password)
        {
            return { user }
        }
    }

    if (user) {
        const value = await bcrypt.compare(password, user.password);
        if (value) {
            return { user };
        } else {
            throw new Error('User is not authorized' );
        }
    }

};

export default SignIn;
