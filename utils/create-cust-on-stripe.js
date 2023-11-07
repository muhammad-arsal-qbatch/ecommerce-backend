import { stripeClient } from '../config/config';

const CreateCustomerOnStripe = async ({ user }) => {
    // eslint-disable-next-line no-unused-vars
  const customer = await stripeClient.customers.create({
    name: user.name,
    email: user.email
  });


}

export default CreateCustomerOnStripe;
