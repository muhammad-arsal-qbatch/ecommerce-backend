import express from 'express';
import passport from 'passport';

import ScriptMethods from '../script-methods';
import DashboardStats from '../models/dashboard-stats';
// import AddCardStripeId from '../utils/add-card-stripeid';
import UpdateOrderStatus from '../utils/update-order-status';
import StoreStripeIdInUser from '../utils/store-stripeid-in-user';

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
  } catch (error) {
    res.send(error.message);
  }
});

nonAuthenticatedRouter.get('/getStats',passport.authenticate('jwt', { session:false }), async (req, res) => {
  try {
    const stats = await DashboardStats.find({});

    res.send(stats);
  } catch (error) {
    res.send(error);
  }
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

  if(event.type === 'customer.source.created')
  {
    // eslint-disable-next-line no-unused-vars
    const cardStripeId = event.data.object.id;
    // const {cardNumber, userStripeId} = event.data.object.metadata

    // await AddCardStripeId({ userStripeId, cardNumber, cardStripeId })
  }
  res.json({ received: true });

});



export default nonAuthenticatedRouter;