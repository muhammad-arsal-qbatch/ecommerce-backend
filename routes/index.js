import express from 'express';
import path from 'path';

import auth from './auth';
import user from './user'
import products from './products';
import orders from './orders';
import nonAuthenticatedRouter from './non-authenticated-routes';
import notification from './notification';

const router = express.Router();

router.use('/auth', auth);
router.use('/users', user);
router.use('/products', products);
router.use('/orders', orders);
router.use('/notification', notification);
router.use('/', nonAuthenticatedRouter);

router.use('/uploads',express.static(path.join(__dirname,'../uploads')));

export default router;
