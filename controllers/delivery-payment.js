/* eslint-disable no-unused-vars */

import { stripeClient, stripeClient2 } from '../config/config';
import User from '../models/user';



const AddDeliveryAddress = async (body) => {
  try {
    const deliveryPerson = {
      name: body.name,
      mobileNo: body.mobileNo,
      province: body.province,
      city: body.city,
      address: body.address,
      country: body.country,
    };
    const singleUser = await User.findOne({ _id: body.userId });
    singleUser.deliveryAddress.push(deliveryPerson);
    await singleUser.save();

    return singleUser;
  } catch(err) {
    throw new Error(err);
  }
};

const AddPaymentMethodToStripe = async ({ paymentMethod, stripeId }) => {
  try {
    const card =  await stripeClient2.tokens.create({
      card: {
        number: paymentMethod.cardNumber,
        exp_month: 11,
        exp_year: 29,
        cvc: paymentMethod.cvc
      }
    })

    // Attach the payment method to the customer
    // eslint-disable-next-line no-unused-vars
    const source = await stripeClient.customers.createSource(stripeId, {
      source: card.id,
      metadata: {
        cardNumber: paymentMethod.cardNumber,
        userStripeId: stripeId,
      },
    });

    console.log('Payment method added to customer:', card);
    return card;
  } catch (error) {
    console.error('Error adding payment method:', error);
    throw new Error(error);
  }
};

const AddPaymentMethod = async (body) => {
  try {
    const paymentMethod = {
      cardNumber: body.cardNumber,
      expiryDate: 29,
      cvc: body.cvc,
      country: body.country,
    };
    const singleUser = await User.findOne({ _id: body.userId });
    const { stripeId } = singleUser;
    // singleUser.paymentMethods.push(paymentMethod);
    // await singleUser.save();
    console.log('customer stripe id is ', singleUser);
    console.log('payment method  is ', paymentMethod);
    await AddPaymentMethodToStripe({ paymentMethod, stripeId })

    return singleUser;
  } catch(err) {
    throw new Error(err);
  }
};

const GetDeliveryAddress = async ({ userId }) => {
  try{
    const user = await User.findOne({ _id: { $in: userId } });

    return user.deliveryAddress[user.selectedPerson];
  } catch(err) {
    throw new Error(err);
  }
};

const GetDefaultPaymentMethod = async ({ userId }) => {
  try{
    const user = await User.findOne({ _id: { $in: userId } });
    const customer = await stripeClient.customers.retrieve(
      user.stripeId
    );
    const card = await stripeClient.customers.retrieveSource(
      user.stripeId,
      customer.default_source
    );
    const cardDetails = {
      cardId: card.id,
      customerName: user.name,
      brand: card.brand,
      cardNumber: card.last4,
      exp_month: card.exp_month,
      exp_year: card.exp_year

    }
    return cardDetails;
  } catch(err) {
    throw new Error(err);
  }
};

const GetAllDeliveryAddress = async ({ userId }) => {
  try{
    const user = await User.findOne({ _id: { $in: userId } });

    return user.deliveryAddress;
  } catch(err) {
    throw new Error(err);
  }
};

const GetAllPaymentMethods = async ({ userId }) => {
  try{
    const user = await User.findOne({ _id: { $in: userId } });
    const cards = await stripeClient.customers.listSources(
      user.stripeId,
      {object: 'card'}
    )
    const allPaymentMethods = cards.data.map(card => ({
      customerName: user.name,
      cardNumber: card.last4,
      cardId: card.id,
      brand: card.brand,
      exp_month: card.exp_month,
      exp_year: card.exp_year,
    }));
    // console.log({ allPaymentMethods });

    return allPaymentMethods;
  } catch (err) {
    throw new Error(err);
  }
};

export {
    AddDeliveryAddress,
    GetDeliveryAddress,
    GetAllDeliveryAddress,
    GetDefaultPaymentMethod,
    GetAllPaymentMethods,
    AddPaymentMethod
};
