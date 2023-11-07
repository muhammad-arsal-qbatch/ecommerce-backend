import mongoose from 'mongoose';

const orders = mongoose.Schema({
  orderId: {
    type: Number,
    required: true,
  },
  products: {  // should not be here.. separate collection product id, quantity, color/size, price, total price, address should be also
    type: Array,
    required: true
  },
  userId: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: false,
  },
  totalQuantity: {
    type: Number,
    required: true,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  date:{
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    default: 'Un Paid'
  },
  delivered: {
    type: String,
    default: 'Not Delivered'
  }
})
const Orders = mongoose.model('orders', orders, 'orders');

export default Orders;

