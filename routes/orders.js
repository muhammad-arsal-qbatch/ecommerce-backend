import express from 'express';
import passport from 'passport';

import {
    DeliverOrder,
    GetOrders,
    PlaceOrder
} from '../controllers';

import { UpdateProductQuantities } from '../controllers';
import User from '../models/user';
import CreateCustomerOnStripe from '../utils/create-cust-on-stripe';
import ChargeCustomer from '../utils/charge-customer';

const orders = express.Router();


orders.post('/placeOrder',passport.authenticate('jwt', { session:false }), async (req, res) => {
  try {
    if(!req.body)
      throw new Error('error while placing order');

    const user = await User.findOne({_id: req.body.finalItems.userId})
    if(!user.stripeId)
    {
      await CreateCustomerOnStripe({ user, res });
    }

    const placedOrders = await PlaceOrder(req.body.finalItems);
    const { email, stripeId } = user;
    const { totalAmount } = placedOrders;
    const { orderId } = placedOrders;
    const cardStripeId = req.body.paymentCard.cardId;
    await ChargeCustomer({ totalAmount, email, stripeId, cardStripeId, orderId });
    await UpdateProductQuantities(placedOrders.products);

    res.send(placedOrders.products);
  } catch (error) {
    res.send(error);
  }
});

orders.get('/getOrders',passport.authenticate('jwt', { session:false }), async (req, res) => {
  try {
    const {
            userId = {},
            sortingObj = {}
        } = req.query
    const response = await GetOrders(userId, sortingObj);

    res.send(response);
  } catch (error) {

    res.send(error);
  }
});

orders.get('/getOrdersByUserId',passport.authenticate('jwt', { session:false }), async (req, res) => {
  try {
    const response = await GetOrders();
    res.send(response);
  } catch (error) { /* empty */ }
});

orders.put('/deliverOrder',passport.authenticate('jwt', { session:false }), async (req, res) => {
  try {
    const response = await DeliverOrder(req.body);

    res.send(response);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

export default orders;
