import express from 'express'
import passport from 'passport';

import { SignIn, SignUp } from '../controllers';
import { AddDeliveryAddress, AddPaymentMethod, GetAllDeliveryAddress, GetAllPaymentMethods, GetDeliveryAddress } from '../controllers/delivery-person';
import { generateToken } from '../middlewares/auth';
import { UpdateDeliveryAddress } from '../controllers/orders';
// import { UpdateDeliveryAddress } from '../controllers/orders';

const router = express.Router();

router.get('/orders', passport.authenticate('jwt', { session:false }), async (req, res) => {
    res.send(req.token);
});

router.post('/signIn', async (req,res)=> {
    // do validation in routes
    const {
        email,
        password
    } = req.body;

    const result = await SignIn({
        email,
        password
    });

    if(!result.message)
    {
        const token = generateToken(email);
        console.log('token is, ',token);
        res.status(200).send({
            message: token,
            user: result.user
        })


    }
    else{
        res.status(401).send({
            message:result.message
        })

    }
})

router.post('/signup', async (req,res) => {
    try{
        const {name,
            email,
            password,
            mobileNo
        } = req.body;
        console.log('in route, password is, ', password);

        const user= await SignUp({ name,email, password, mobileNo });
        console.log('user id is, ', user.user._id);
        console.log('in route user is, ', user);
        res.send(user);
    }catch (error){
        console.log('user is ', error);

        console.log('there is some error')
    }


})

router.post('/addDeliveryAddress', async (req, res) => {
    try{
        console.log('req.body', req.body);
        const resposne = await AddDeliveryAddress(req.body)
        console.log('delivery addrss are, ', resposne);
        res.send(resposne);


    }catch(err){
        res.status(400).send(err);
    }
})
router.post('/addPaymentMethod', async (req, res) => {
    try{
        console.log('req.body', req.body);
        const resposne = await AddPaymentMethod(req.body)
        console.log('payment methods are, ', resposne);
        res.send(resposne);


    }catch(err){
        res.status(400).send(err);
    }
})
router.put('/updateDeliveryPerson', async (req, res) => {
    try{
        console.log('req.body', req.body);
        const resposne = await UpdateDeliveryAddress(req.body)
        console.log('delivery addrss are, ', resposne);
        res.send(resposne);


    }catch(err){
        res.status(400).send(err);
    }
})
// router.put('/updateDeliveryPersons', async (req, res) => {
//     try{
//         const resposne = await UpdateDeliveryPersons(req.body)
//         console.log({ resposne })
//         res.send({ resposne });


//     }catch(err){
//         res.status(400).send(err);
//     }
// })
router.get('/getDeliveryAddress', async (req, res) => {
    try{
        // console.log('user id is ,', req.query);
        const resposne = await GetDeliveryAddress(req.query)
        // console.log({ resposne })
        res.send(resposne);


    }catch(err){
        res.status(400).send(err);
    }
})
router.get('/getAllDeliveryAddress', async (req, res) => {
    try{
        console.log('user id is ,', req.query);
        const resposne = await GetAllDeliveryAddress(req.query)
        console.log({ resposne })
        res.send(resposne);


    }catch(err){
        res.status(400).send(err);
    }
})
router.get('/getPaymentMethod', async (req, res) => {
    try{
        console.log('user id is ,', req.query);
        const resposne = await GetDeliveryAddress(req.query)
        console.log({ resposne })
        res.send(resposne);


    }catch(err){
        res.status(400).send(err);
    }
})
router.get('/getAllPaymentMethods', async (req, res) => {
    try{
        console.log('user id is ,', req.query);
        const resposne = await GetAllPaymentMethods(req.query)
        console.log({ resposne })
        res.send(resposne);


    }catch(err){
        res.status(400).send(err);
    }
})
export default router;
