import mongoose from 'mongoose';

const dashboardStatSchema = mongoose.Schema(
  {
    todayStats: {
      type: Object
    },
    sevenDayStats: {
      type: Object
    },
    thirtyDayStats: {
      type: Object
    },
    oneYearStats: {
      type: Object
    },
    topSellingProducts: {
      type: Array
    },
    ordersPaid: {
      type: Number,
      default: 0
    },
    ordersUnpaid: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

const DashboardStats = mongoose.model('DashboardStats', dashboardStatSchema);

export default DashboardStats;