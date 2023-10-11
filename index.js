import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import './config/';
import ApplyMiddlewares from './middlewares';
import router from './routes';
import { PORT } from './config/config'

const app = express();

app.use(cors());
ApplyMiddlewares(app);

app.use('/', router);

app.listen(PORT, () => {
  console.log(`app is listening to port ${PORT}`);
});
