import express from 'express';
import passport from 'passport';

import ScriptMethods from '../script-methods';
import DashboardStats from '../models/dashboard-stats';
import UpdateOrderStatus from '../utils/update-order-status';
import StoreStripeIdInUser from '../utils/store-stripeid-in-user';
import CatchResponse from '../utils/catch-response';

const nonAuthenticatedRouter = express.Router();

nonAuthenticatedRouter.get('/script', async (req, res) => {
  try {
    const { query } = req;
    const {
            method,
            ...rest
        } = query;

    await ScriptMethods({
      method,
      ...rest
    });

    res.send('OK');
  } catch (err) {
    err.statusCode = 401;
    CatchResponse({ res, err })
  }
});

nonAuthenticatedRouter.get('/getStats',passport.authenticate('jwt', { session:false }), async (req, res) => {
  try {
    const stats = await DashboardStats.find({});

    res.send(stats);
  } catch (err) {
    err.statusCode = 401;
    CatchResponse({ res, err })  }
});

nonAuthenticatedRouter.post('/webhook', async (req, res)=> {
  const event = req.body;

  if(event.type === 'customer.created')
  {
    const { email, id } = event.data.object;
    await StoreStripeIdInUser({ userEmail:email, stripeId: id});
  }

  if(event.type === 'charge.succeeded'){
    const { orderId } = event.data.object.metadata;
    await UpdateOrderStatus({ orderId });
  }

  res.json({ received: true });
});



export default nonAuthenticatedRouter;