import express from 'express';

import auth from './auth';
import user from './user'
import products from './products';
import orders from './orders';
import nonAuthenticatedRouter from './non-authenticated-routes';

const router = express.Router();

router.use('/auth', auth);
router.use('/users', user);
router.use('/products', products);
router.use('/orders', orders);
router.use('/', nonAuthenticatedRouter);

export default router;
