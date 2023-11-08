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
import CatchResponse from '../utils/catch-response';

const router = express.Router();

router.post('/addDeliveryAddress',passport.authenticate('jwt', { session:false }), async (req, res) => {
  try {
    await AddDeliveryAddress(req.body)

    res.send(req.body);
  } catch(err) {
    err.statusCode = 400;
    CatchResponse({ res, err })
  }
});

router.post('/addPaymentMethod',passport.authenticate('jwt', { session:false }), async (req, res) => {
  try {
    const user = await User.findOne({_id: req.body.userId})
    if(!user.stripeId)
    {
      await CreateCustomerOnStripe({ user });
    }
    await AddPaymentMethod(req.body);

    res.send(req.body);
  } catch(err) {
    err.statusCode = 400;
    CatchResponse({ res, err });
  }
});

router.put('/updateDeliveryPerson',passport.authenticate('jwt', { session:false }), async (req, res) => {
  try{
    const resposne = await UpdateDeliveryAddress(req.body)
    res.send(resposne);
  } catch(err) {
    err.statusCode = 500;
    CatchResponse({ res, err });
  }
});

router.get('/getDeliveryAddress',passport.authenticate('jwt', { session:false }), async (req, res) => {
  try{
    const resposne = await GetDeliveryAddress(req.query)
    res.send(resposne);
  } catch(err) {
    err.statusCode = 500;
    CatchResponse({ res, err });
  }
});

router.get('/getAllDeliveryAddress',passport.authenticate('jwt', { session:false }), async (req, res) => {
  try{
    const resposne = await GetAllDeliveryAddress(req.query)
    res.send(resposne);
  } catch(err) {
    CatchResponse({ res, err });
  }
});

router.get('/getDefaultPaymentMethod',passport.authenticate('jwt', { session:false }), async (req, res) => {
  try{
    const resposne = await GetDefaultPaymentMethod(req.query)
    res.send(resposne);
  } catch(err) {
    err.statusCode = 500;
    CatchResponse({ res, err });
  }
});

router.get('/getAllPaymentMethods',passport.authenticate('jwt', { session:false }), async (req, res) => {
  try{
    const resposne = await GetAllPaymentMethods(req.query)
    res.send(resposne);
  } catch(err) {
    err.statusCode = 500;
    CatchResponse({ res, err });
  }
});

export default router;
