import { stripeClient } from '../config/config';

const CreateCustomerOnStripe = async ({ user }) => {
  try{
    // eslint-disable-next-line no-unused-vars
    const customer = await stripeClient.customers.create({
      name: user.name,
      email: user.email
    });
  } catch (error) {
    throw new Error('error while creating customer on stripe');
  }

}

export default CreateCustomerOnStripe;
