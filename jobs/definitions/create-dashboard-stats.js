import moment from 'moment';

import Agenda from '../config';

import { JOB_STATES } from '../utils';

import Orders from '../../models/orders';

import DashboardStats from '../../models/dashboard-stats';

Agenda.define('create-dashboard-stats', { concurrency: 1 }, async (job, done) => {
  console.log('*********************************************************');
  console.log('*********  Create Dashboard Stats Job Started   *********');
  console.log('*********************************************************');

  job.attrs.state = JOB_STATES.STARTED;
  job.attrs.progress = 0;
  await job.save();

  const { type } = job.attrs.data;
  console.log('\n\n', { type });

  try {
    job.attrs.state = JOB_STATES.IN_PROGRESS;
    job.attrs.progress = 25;
    await job.save();

    let startDate = moment().startOf('day').toDate();
    console.log('start date , ', startDate);
    let endDate = moment().endOf('day').toDate();
    const todayStats = await Orders.aggregate([{
      $match: {
        date: { $gte: startDate, $lte: endDate }
      }
    }, {
      $group: {
        _id: null,
        totalOrders: { $sum: 1 },
        totalQuantity: { $sum: '$totalQuantity' },
        totalAmount: { $sum: '$totalAmount' }
      }
    }]);

    job.attrs.progress = 50;
    await job.save();

    startDate = moment().subtract(7, 'days').toDate();
    endDate = moment().toDate();
    const sevenDayStats = await Orders.aggregate([{
      $match: {
        date: { $gte: startDate, $lte: endDate }
      }
    }, {
      $group: {
        _id: null,
        totalOrders: { $sum: 1 },
        totalQuantity: { $sum: '$totalQuantity' },
        totalAmount: { $sum: '$totalAmount' }
      }
    }]);

    job.attrs.progress = 75;
    await job.save();

    startDate = moment().subtract(30, 'days').toDate();
    endDate = moment().toDate();
    const thirtyDayStats = await Orders.aggregate([{
      $match: {
        date: { $gte: startDate, $lte: endDate }
      }
    }, {
      $group: {
        _id: null,
        totalOrders: { $sum: 1 },
        totalQuantity: { $sum: '$totalQuantity' },
        totalAmount: { $sum: '$totalAmount' }
      }
    }]);

    job.attrs.lockedAt = null;
    job.attrs.state = JOB_STATES.COMPLETED;
    job.attrs.progress = 100;
    await job.save();

    const stat = new DashboardStats({
      todayStats: todayStats[0],
      sevenDayStats: sevenDayStats[0],
      thirtyDayStats: thirtyDayStats[0]
    });
    const total = await DashboardStats.countDocuments();
    if (total > 0) {
      await stat.updateOne({},{ exclude: ['_id'] })
    } else {
      await stat.save();
    }

    console.log('*********************************************************');
    console.log('********  Create Dashboard Stats Job Completed   ********');
    console.log('*********************************************************');
  } catch (error) {
    console.log('*********************************************************');
    console.log('***********  Create Dashboard Stats Job Retry  **********');
    console.log('*********************************************************');
    console.log(error);
    console.log('*********************************************************');

    job.attrs.state = JOB_STATES.FAILED;
    job.attrs.failedAt = new Date();
    job.attrs.failReason = error.message;

    await job.save();
  }

  done();
});