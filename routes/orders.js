import express from 'express';

import { DeliverOrder, GetOrders, GetOrdersInGroup, PlaceOrder } from '../controllers/orders';
import { UpdateProductQuantities } from '../controllers/products';

const orders = express.Router();

orders.post('/placeOrder', async (req, res) => {
    console.log(req);
    try {
        console.log('order in api ,', req.body);
        const placedOrders = await PlaceOrder(req.body);
        console.log('placd orders is, ', placedOrders);
        await UpdateProductQuantities(placedOrders.products);
        res.send(placedOrders.products);
    } catch (error) {
        console.log(error);
        res.send('errror');
    }
});

orders.get('/getOrders', async (req, res) => {
    try {
        const userId = req.query.userId;
        // console.log('user id is, ', userId)
        const response = await GetOrders({ userId });
        // console.log({ response });
        res.send(response);
    } catch (error) {
        console.log(error);
        res.send(error);
    }
});
orders.get('/getOrdersInGroup', async (req, res) => {
    try {
        const response = await GetOrdersInGroup();
        // console.log({ response });
        res.send(response);
    } catch (error) {
        console.log(error);
    }
});
orders.get('/getOrdersByUserId', async (req, res) => {
    try {
        const response = await GetOrders();
        // console.log({ response });
        res.send(response);
    } catch (error) {
        console.log(error);
    }
});
orders.put('/deliverOrder', async (req, res) => {
    try {
        console.log(req.body);
        const response = await DeliverOrder(req.body);
        console.log({ response });
        res.send(response);
    } catch (error) {
        console.log(error);
        res.send(error);
    }
});
export default orders;
