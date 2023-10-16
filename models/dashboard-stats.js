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
        }
    },
    {
        timestamps: true
    }
);

const DashboardStats = mongoose.model('DashboardStats', dashboardStatSchema);

export default DashboardStats;