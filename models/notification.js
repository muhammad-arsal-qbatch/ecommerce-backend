import mongoose from 'mongoose';

const notification = mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  orderId: {
    type: Number,
    required: true
  },
  text:{
    type: String
  },
  isRead: {
    type: Boolean,
    default: false
  }
},
  {
    timestamps: true
  }
);
const Notification = mongoose.model('notification', notification, 'notification');

export default Notification;

