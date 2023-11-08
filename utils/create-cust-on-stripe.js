import { stripeClient } from '../config/config';

const CreateCustomerOnStripe = async ({ user }) => {
  console.log('create customer on stripe called');
  const customer = await stripeClient.customers.create({
    name: user.name,
    email: user.email
  });

  return customer;
}

export default CreateCustomerOnStripe;
