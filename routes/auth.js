import express from 'express';

import { SignIn, SignUp } from '../controllers';
import { GenerateToken } from '../middlewares/auth';
// import CatchResponse from '../utils/catch-response';

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

export default router;
