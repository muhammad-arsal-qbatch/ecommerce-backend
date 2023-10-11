import express from 'express';

import auth from './auth';
import user from './user'
import products from './products';

const router = express.Router();

router.use('/auth', auth);
router.use('/users', user);
router.use('/products', products);

export default router;
