import express from 'express';
import passport from 'passport';

import {
    DeliverOrder,
    GetOrders,
    MakeNotification,
    PlaceOrder
} from '../controllers';

import { UpdateProductQuantities } from '../controllers';
import User from '../models/user';
import CreateCustomerOnStripe from '../utils/create-cust-on-stripe';
import ChargeCustomer from '../utils/charge-customer';
import CatchResponse from '../utils/catch-response';

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
    const userId = '6537760f808f26056f6b1d64';
    await MakeNotification({ orderId, userId, text: `New Order received Order# ${orderId}` });

    res.send(placedOrders.products);
  } catch (err) {
    err.statusCode = 401;
    CatchResponse({ res, err });  }
});

orders.get('/getOrders',passport.authenticate('jwt', { session:false }), async (req, res) => {
  try {
    const {
            userId = {},
            sortingObj = {}
        } = req.query
    const response = await GetOrders(userId, sortingObj);

    res.send(response);
  } catch (err) {
    err.statusCode = 401;
    CatchResponse({ res, err });
  }
});

orders.get('/getOrdersByUserId',passport.authenticate('jwt', { session:false }), async (req, res) => {
  try {
    const response = await GetOrders();
    res.send(response);
  } catch (err) {
    err.statusCode = 401;
    CatchResponse({ res, err });
  }
});

orders.put('/deliverOrder',passport.authenticate('jwt', { session:false }), async (req, res) => {
  try {
    const response = await DeliverOrder(req.body);
    console.log('body iss  ', req.body);
    const{ orderId, userId } = req.body
    await MakeNotification({ orderId, userId, text: `your Order# ${orderId} has been delivered to u` });


    res.send(response);
  } catch (err) {
    err.statusCode = 401;
    CatchResponse({ res, err })
  }
});

export default orders;
