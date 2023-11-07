import moment from 'moment';

import Agenda from '../config';

import { JOB_STATES } from '../utils';

import Orders from '../../models/orders';

import DashboardStats from '../../models/dashboard-stats';
import Product from '../../models/products';

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
    startDate = moment().subtract(365, 'days').toDate();
    endDate = moment().toDate();
    const oneYearStats = await Orders.aggregate([
      {
        $match: {
          date: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $project: {
          year: { $year: '$date' },
          month: { $month: '$date' },
          totalAmount: 1
        }
      },
      {
        $group: {
          _id: {
            year: '$year',
            month: '$month'
          },
          orders: { $sum: 1 },
          sales: { $sum: '$totalAmount' }
        }
      },
      {
        $project: {
          name:  '$_id.month',
          orders: 1,
          sales: 1,
          year: '$_id.year',
          _id: 0
        }
      }
    ]);

    const topSellingProducts = await Product.aggregate([
      {
        '$sort': {
          'totalSold': -1
        }
      }, {
        '$limit': 7
      }
    ]);
    // console.log('top selling products are  ', topSellingProducts);
    // const ordersPaid = await Orders.find({status: 'Paid'}).length;
    // const ordersUnpaid = await Orders.find({status: 'Un Paid'}).length();
    // console.log('Orders paid are  ', ordersPaid);
    // console.log('Orders unpaid are  ', ordersUnpaid);

    const ordersStatus = await Orders.aggregate([
      {
        $group: {
          _id: '$status',
          ordersPaid: {
            $sum: {
              $cond: { if: { $eq: ['$status', 'Paid'] }, then: 1, else: 0 }
            }
          },
          ordersUnpaid: {
            $sum: {
              $cond: { if: { $eq: ['$status', 'Un Paid'] }, then: 1, else: 0 }
            }
          }
        }
      }
    ]);
    console.log('order status ', ordersStatus);
    const ordersPaid = ordersStatus[0].ordersPaid ?ordersStatus[0].ordersPaid :ordersStatus[1].ordersPaid;
    const ordersUnpaid = ordersStatus[1].ordersUnpaid ? ordersStatus[1].ordersUnpaid : ordersStatus[0].ordersUnpaid;
    console.log('paid orders are  ', ordersPaid);
    console.log('unpaid orders are  ', ordersUnpaid);

    job.attrs.lockedAt = null;
    job.attrs.state = JOB_STATES.COMPLETED;
    job.attrs.progress = 100;
    await job.save();

    const stat = {
      todayStats: todayStats[0],
      sevenDayStats: sevenDayStats[0],
      thirtyDayStats: thirtyDayStats[0],
      oneYearStats,
      topSellingProducts,
      ordersPaid,
      ordersUnpaid
    };
    console.log('stats ', stat);
    const total = await DashboardStats.countDocuments();
    if (total > 0) {
      await DashboardStats.updateOne( {},stat, { upsert: true });
    } else {
      await stat.save();
    }

    console.log('*********************************************************');
    console.log('********  Create Dashboard Stats Job Completed   ********');
    console.log('*********************************************************');
    await job.save();
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