import express from 'express';

import {
    DeliverOrder,
    GetOrders,
    GetOrdersInGroup,
    PlaceOrder
} from '../controllers/orders';

import { UpdateProductQuantities } from '../controllers/products';

const orders = express.Router();

orders.post('/placeOrder', async (req, res) => {
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

orders.get('/getOrders', async (req, res) => {
    try {
        if(!req.query.userId)
            throw new Error('Error while getting order');

        const userId = req.query.userId;
        const response = await GetOrders({ userId });

        res.send(response);
    } catch (error) {

        res.send(error);
    }
});

orders.get('/getOrdersInGroup', async (req, res) => {
    try {
        const response = await GetOrdersInGroup();

        res.send(response);
    } catch (error) {
        res.status(401).send({ error: error.message });
    }
});

orders.get('/getOrdersByUserId', async (req, res) => {
    try {
        const response = await GetOrders();
        res.send(response);
    } catch (error) {
        console.log(error);
    }
});

orders.put('/deliverOrder', async (req, res) => {
    try {
        const response = await DeliverOrder(req.body);

        res.send(response);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

export default orders;
