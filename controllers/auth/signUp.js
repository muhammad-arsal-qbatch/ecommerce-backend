import User from "../../models/userSchema"
import {hashPassword} from '../../middlewares/auth'

const SignUp =  async (name, email, password) => {
  console.log('isnide signup controller');
  const p= await hashPassword(password);
  console.log('hashed password is , ',p);
  const user= new User({
    name,
    email,
    password:p
  })
  // console.log('hashed password', user.password);

  user.save()
  return user;


}
export default SignUp