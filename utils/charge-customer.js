import { stripeClient } from '../config/config';

const ChargeCustomer = async ({ totalAmount, email,stripeId, cardStripeId, orderId }) => {
  try {
    // eslint-disable-next-line no-unused-vars
    const charge = await stripeClient.charges.create({
      amount: 100*totalAmount,
      currency: 'usd',
      customer: stripeId,
      card: cardStripeId,
      receipt_email: email,
      metadata: {
        orderId: orderId,
      },
    });

  } catch (error) {
    throw new Error(error);
  }
};

export default ChargeCustomer;

