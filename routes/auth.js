import express from 'express';
import passport from 'passport';

import {
    SignIn,
    SignUp,
    ForgotPassword,
} from '../controllers';

import { HashPassword } from '../middlewares/auth';
import { GenerateToken } from '../middlewares/auth';
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
            res.status(401).send({ error: 'please provide complete credentials' });
            return;
        }
        const result = await SignIn({
            email,
            password
        });

        if(!result.message)
        {
            const token = GenerateToken(email);
            res.status(200).send({
                message: token,
                user: result.user
            })
        }
    }catch (error) {
        res.status(401).send({ error: error.message });

        return;
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
            res.status(401).send({ error: 'Please provide Complete Credemtials' })

            return;
        }
        const user= await SignUp({ name, email, password, mobileNo });
        res.send(user);
    }catch (err) {
        res.status(500).send({ error: err.message });
    }
})

router.post('/forgotPassword', async(req, res) => {
    try{
        const resetToken =  await ForgotPassword(req.body);
        res.send(resetToken);
    } catch (err) {
        res.status(400).send({error: err.message});
    }
})

router.post('/resetPassword',passport.authenticate('jwt', { session:false }), async(req, res) => {
    try{
        const newPassword = req.body.newPassword
        const email = req.user[0].email;
        const hashedPassword = await HashPassword(newPassword);

        await User.findOneAndUpdate({ email }, { password: hashedPassword });
        res.send(req.body);
    } catch (err) {
        res.status(400).send({error: err.message});
    }
})

export default router;
