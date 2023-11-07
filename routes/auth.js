import express from 'express';
import passport from 'passport';

import {
    SignIn,
    SignUp,
    ForgotPassword,
} from '../controllers';

import CatchResponse from '../utils/catch-response';
import HashPassword from '../utils/hash-password';
import GenerateToken from '../utils/generate-token';
import User from '../models/user';

const router = express.Router();

router.post('/signIn', async (req,res) => {
  const {
        email,
        password
    } = req.body;

  try{
    if(email === '' || password === '')
        {
      throw new Error('please provide complete credentials')
    }
    const result = await SignIn({
      email,
      password
    });

    if(!result.message)
        {
      const token = GenerateToken(email);
      console.log('user is  ', result.user);
      res.status(200).send({
        message: token,
        user: result.user
      })
    }
  }catch (error) {
    error.statusCode = 401;
    CatchResponse({ res, err: error })
  }
})

router.post('/signup', async (req,res) => {
  try{
    const {
            name,
            email,
            password,
            mobileNo
        } = req.body;
    if(email === '' || name === '' || password === ''){
      throw new Error('Please provide Complete Credemtials');
    }

    const user= await SignUp({ name, email, password, mobileNo });

    res.send(user);
  }catch (err) {
    console.log('error is ', err.message);
    err.statusCode = 401;
    CatchResponse({ res, err })
  }
})

router.post('/forgotPassword', async(req, res) => {
  try{
    const resetToken =  await ForgotPassword(req.body);
    res.send(resetToken);
  } catch (err) {
    err.statusCode = 401;
    CatchResponse({ res, err })
  }
})

router.post('/resetPassword',passport.authenticate('jwt', { session:false }), async(req, res) => {
  try{
    const newPassword = req.body.newPassword
    const email = req.user[0].email;
    const hashedPassword = await HashPassword(newPassword);

    await User.update({ email }, { password: hashedPassword });
    res.send(req.body);
  } catch (err) {
    err.statusCode = 400;
    CatchResponse({ res, err });
  }
})

export default router;
