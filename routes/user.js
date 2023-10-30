import express from 'express'
import passport from 'passport';

import {
    AddDeliveryAddress,
    AddPaymentMethod,
    GetAllDeliveryAddress,
    GetAllPaymentMethods,
    GetDeliveryAddress,
    GetDefaultPaymentMethod
} from '../controllers';
import CreateCustomerOnStripe from '../utils/create-cust-on-stripe';
import { UpdateDeliveryAddress } from '../controllers';
import User from '../models/user';

const router = express.Router();

router.get('/orders', passport.authenticate('jwt', { session:false }), async (req, res) => {
  res.send(req.token);
});

router.post('/addDeliveryAddress', async (req, res) => {
  try {
    // eslint-disable-next-line no-unused-vars
    const resposne = await AddDeliveryAddress(req.body)
    res.send(req.body);
  } catch(err) {
    res.status(400).send(err);
  }
});

router.post('/addPaymentMethod', async (req, res) => {
  try {
    const user = await User.findOne({_id: req.body.userId})
    if(!user.stripeId)
    {
      await CreateCustomerOnStripe({ user });
    }

    // eslint-disable-next-line no-unused-vars
    const resposne = await AddPaymentMethod(req.body);
    console.log('my response is  ', resposne);
    res.send(req.body);
  } catch(err) {
    res.status(400).send(err);
  }
});

router.put('/updateDeliveryPerson', async (req, res) => {
  try{
    const resposne = await UpdateDeliveryAddress(req.body)
    res.send(resposne);
  } catch(err) {
    res.status(400).send(err);
  }
});

router.get('/getDeliveryAddress', async (req, res) => {
  try{
    const resposne = await GetDeliveryAddress(req.query)
    res.send(resposne);
  } catch(err) {
    res.status(400).send(err);
  }
});

router.get('/getAllDeliveryAddress', async (req, res) => {
  try{
    const resposne = await GetAllDeliveryAddress(req.query)
    res.send(resposne);
  } catch(err) {
    res.status(400).send(err);
  }
});

router.get('/getDefaultPaymentMethod', async (req, res) => {
  try{
    const resposne = await GetDefaultPaymentMethod(req.query)
    res.send(resposne);
  } catch(err) {
    res.status(400).send(err);
  }
});

router.get('/getAllPaymentMethods', async (req, res) => {
  try{
    const resposne = await GetAllPaymentMethods(req.query)
    res.send(resposne);
  } catch(err) {
    res.status(400).send(err);
  }
});

export default router;
