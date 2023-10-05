import express from 'express';

import catchResponse from '../utils/catch-response';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const {
      data
    } = req.body
    res.status(200).send({ message: 'This is the first file' });
  } catch (err) {
    catchResponse({
      res,
      err
    });
  }
});

export default router;
