import express from 'express';
import passport from 'passport';

import {
    DeliverOrder,
    GetOrders,
    PlaceOrder
} from '../controllers';

import { UpdateProductQuantities } from '../controllers';

import DashboardStats from '../models/dashboard-stats';

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
        const stats = await DashboardStats.find({});

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
        const response = await GetOrders(userId, sortingObj);

        res.send(response);
    } catch (error) {

        res.send(error);
    }
});


orders.get('/getOrdersByUserId',passport.authenticate('jwt', { session:false }), async (req, res) => {
    try {
        const response = await GetOrders();
        res.send(response);
    } catch (error) { /* empty */ }
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
