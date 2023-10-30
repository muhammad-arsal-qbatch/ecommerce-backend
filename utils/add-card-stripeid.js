import User from '../models/user';

const AddCardStripeId = async ({userStripeId, cardNumber, cardStripeId}) => {
  try {
    const result = await User.updateOne(
      {
        stripeId: userStripeId,
        'paymentMethods.cardNumber': cardNumber,
      },
      {
        $set: {
          'paymentMethods.$.stripeId': cardStripeId,
        },
      }
    );

    return result;
  } catch (error) {
    throw new Error(error)
  }
};

export default AddCardStripeId;
