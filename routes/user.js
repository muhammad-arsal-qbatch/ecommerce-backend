import express from 'express'
import passport from 'passport';

import {
    AddDeliveryAddress,
    AddPaymentMethod,
    GetAllDeliveryAddress,
    GetAllPaymentMethods,
    GetDeliveryAddress
} from '../controllers/delivery-person';

import { UpdateDeliveryAddress, UpdatePaymentMethod } from '../controllers/orders';

const router = express.Router();

router.get('/orders', passport.authenticate('jwt', { session:false }), async (req, res) => {
    console.log('token ', req.token);
    res.send(req.token);
});
router.post('/addDeliveryAddress', async (req, res) => {
    try {
        const resposne = await AddDeliveryAddress(req.body)
        res.send(resposne);
    } catch(err) {
        res.status(400).send(err);
    }
})
router.post('/addPaymentMethod', async (req, res) => {
    try {
        const resposne = await AddPaymentMethod(req.body)
        res.send(resposne);
    } catch(err) {
        res.status(400).send(err);
    }
})
router.put('/updateDeliveryPerson', async (req, res) => {
    try{
        const resposne = await UpdateDeliveryAddress(req.body)
        res.send(resposne);
    } catch(err) {
        res.status(400).send(err);
    }
})
router.put('/updatePaymentMethod', async (req, res) => {
    try{
        const resposne = await UpdatePaymentMethod(req.body)
        res.send(resposne);
    } catch(err) {
        res.status(400).send(err);
    }
})
router.get('/getDeliveryAddress', async (req, res) => {
    try{
        const resposne = await GetDeliveryAddress(req.query)
        res.send(resposne);
    } catch(err) {
        res.status(400).send(err);
    }
})
router.get('/getAllDeliveryAddress', async (req, res) => {
    try{
        const resposne = await GetAllDeliveryAddress(req.query)
        res.send(resposne);
    } catch(err) {
        res.status(400).send(err);
    }
})
router.get('/getPaymentMethod', async (req, res) => {
    try{
        const resposne = await GetDeliveryAddress(req.query)
        res.send(resposne);
    } catch(err) {
        res.status(400).send(err);
    }
})
router.get('/getAllPaymentMethods', async (req, res) => {
    try{
        const resposne = await GetAllPaymentMethods(req.query)
        res.send(resposne);
    } catch(err) {
        res.status(400).send(err);
    }
})

export default router;
