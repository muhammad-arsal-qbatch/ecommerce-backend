import User from '../models/user';

const StoreStripeIdInUser = async ({ userEmail, stripeId }) => {
  try{
    await User.updateOne({ email: userEmail }, { $set: { stripeId : stripeId } });

  } catch (error) {
    throw new Error(error);
  }
}

export default StoreStripeIdInUser;
