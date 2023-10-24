import bcrypt from 'bcrypt';

import User from '../../models/user';

const SignIn = async ({
    email,
    password
}) => {
    const user = await User.findOne({ email });
    if(!user)
        throw new Error('Please create account first' );

    if (user) {
        console.log('password and user password is, ', password, user.password);
        const value = await bcrypt.compare(password, user.password);
        console.log('value is , ', value);
        if (value) {
            console.log('inside true');
            return { user };
        } else {
            throw new Error('Invalid Credentials' );
        }
    }

};

export default SignIn;
