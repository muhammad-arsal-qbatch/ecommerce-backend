import User from '../../models/user';

import { HashPassword } from '../../middlewares/auth';

const SignUp = async ({
    name,
    email,
    password,
    mobileNo
}) => {
    const user = await User.findOne({ email });
    if (!user) {
        const hashedPassword = await HashPassword(password);
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            mobileNo,
            deliveryAddress: [],
            selectedPerson: 0
        });

        newUser.save();

        return { user: newUser };
    }

    throw new Error('user with this email already exist, please use different email');
};

export default SignUp;
