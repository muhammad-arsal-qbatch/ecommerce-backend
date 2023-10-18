import express from 'express';
import passport from 'passport';

import {
    DeliverOrder,
    GetOrders,
    GetOrdersInGroup,
    PlaceOrder
} from '../controllers/orders';

import DashboardStats from '../models/dashboard-stats';

import { UpdateProductQuantities } from '../controllers/products';

const orders = express.Router();

orders.post('/placeOrder',passport.authenticate('jwt', { session:false }), async (req, res) => {
    try {
        if(!req.body)
            throw new Error('error while placing order');

        const placedOrders = await PlaceOrder(req.body);
        await UpdateProductQuantities(placedOrders.products);

        res.send(placedOrders.products);
    } catch (error) {
        res.send(error);
    }
});

orders.get('/getStats',passport.authenticate('jwt', { session:false }), async (req, res) => {
    try {
        // if(!req.body)
        //     throw new Error('error while placing order');

        const stats = await DashboardStats.find({});
        console.log({ stats });

        res.send(stats);
    } catch (error) {
        res.send(error);
    }
});

orders.get('/getOrders',passport.authenticate('jwt', { session:false }), async (req, res) => {
    try {
        const {
            userId = {},
            sortingObj = {}
        } = req.query
        console.log(' user id isss,  ', userId)
        console.log(' sorting object,  ', sortingObj)
        const response = await GetOrders(userId, sortingObj);
        console.log('responsee is, ', response)

        res.send(response);
    } catch (error) {

        res.send(error);
    }
});

orders.get('/getOrdersInGroup',passport.authenticate('jwt', { session:false }), async (req, res) => {
    try {
        const response = await GetOrdersInGroup();

        res.send(response);
    } catch (error) {
        res.status(401).send({ error: error.message });
    }
});

orders.get('/getOrdersByUserId',passport.authenticate('jwt', { session:false }), async (req, res) => {
    try {
        const response = await GetOrders();
        res.send(response);
    } catch (error) {
        console.log(error);
    }
});

orders.put('/deliverOrder',passport.authenticate('jwt', { session:false }), async (req, res) => {
    try {
        const response = await DeliverOrder(req.body);

        res.send(response);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

export default orders;
