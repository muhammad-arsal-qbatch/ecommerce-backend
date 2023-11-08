import mongoose from 'mongoose';
import HashPassword from '../utils/hash-password';
import CreateCustomerOnStripe from '../utils/create-cust-on-stripe';

const user = mongoose.Schema({
  name: String,
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  mobileNo: String,

  deliveryAddress: {
    type: Array,
    default: []
  },

  selectedPerson: {
    type: Number,
    default: 0
  },

  stripeId: {
    type: String,
    default : ''
  },
  admin: {
    type: Boolean,
    default: false
  }
})

user.pre('save', async function(next){
  try{
    const hashedPassword = await HashPassword(this.password);
    this.password = hashedPassword;
    console.log('in pre hook, hashed password is', this.password);
  } catch(err) {
    next(err);
  }

  next();
})

user.post('save', async function(user, next){
  try{
    console.log('post hook is called');
    if(!user.stripeId)
      await CreateCustomerOnStripe({ user })

  } catch(error) {
    const err = new Error('error while creating customer on stripe');
    console.log('huihui', err.message);
    return next(err);
  }
  next();
})

const User = mongoose.model('users', user, 'users')

export default User;
