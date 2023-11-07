import User from '../../models/user';


const SignUp = async ({
    name,
    email,
    password,
    mobileNo
}) => {
  const user = await User.findOne({ email });
  if (!user) {
    const newUser = new User({
      name,
      email,
      password,
      mobileNo,
      deliveryAddress: [],
      selectedPerson: 0
    });
    await newUser.save();

    return { user: newUser };
  }

  throw new Error('user with this email already exist, please use different email');
};

export default SignUp;
