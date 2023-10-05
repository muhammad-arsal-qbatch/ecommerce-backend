import bcrypt from 'bcrypt';
import User from "../../models/userSchema";


const SignIn = async (email, password) => {

  const user = await User.findOne({ email }); // finding the user
  if(user) {
     const value = await bcrypt.compare(password, user.password) 
     if (value) {
      return 'Password Matched'
     } else {
      return 'User is not authorized';
      
     }

  }
  else{
    return 'Please create account first'
  }
};

export default SignIn;
