import express from 'express';
import passport from 'passport';

import Notification from '../models/notification';
import CatchResponse from '../utils/catch-response';

const notification = express.Router();

notification.post('/makeNotification', passport.authenticate('jwt', { session:false }), async (req, res) => {
  try{
    const { orderId, text, userId } = req.body;
    const notification = new Notification({
      userId,
      orderId,
      text
    });
    await notification.save();
    res.status(200).send({ message: true });


  } catch (error) {
    const err = new Error('Error while making notification');
    err.statusCode = 401;
    CatchResponse({ res, err })  }

});

notification.put('/readNotification', passport.authenticate('jwt', { session:false }), async (req, res) => {
  try {
    const { orderId, userId } =req.body;
    console.log('user id and order id is ', userId, orderId);
    await Notification.updateOne({ userId, orderId }, {
      $set: {
        isRead: true
      }
    });
    res.status(200).send({ message: true });

  } catch(error) {
    const err = new Error('Error while reading notification');
    err.statusCode = 401;
    CatchResponse({ res, err })
  }
})

notification.get('/getNotifications',passport.authenticate('jwt', { session:false }), async (req, res)=> {
  try{
    const { userId } = req.query;
    console.log('user id is ', userId);
    const response = await Notification.find({ userId, isRead: false }, { orderId: 1, text: 1, _id: 0});
    console.log('response is  ', response);
    res.send(response);
  } catch(error) {
    const err = new Error('Error while Getting Notification');
    err.statusCode = 401;
    CatchResponse({ res, err })  }
})




export default notification;
