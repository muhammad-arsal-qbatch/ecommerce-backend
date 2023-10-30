import 'dotenv/config';
import express from 'express';
import './jobs/definitions'
import './config/';
import ApplyMiddlewares from './middlewares';
import router from './routes';
import { PORT } from './config/config'
import AgendaJobs from './jobs/config';


const app = express();
ApplyMiddlewares(app);

app.use('/', router);

app.listen(PORT, async () => {
  await AgendaJobs._ready;
  AgendaJobs.start();

  console.log(`app is listening to port ${ PORT }`);
});
