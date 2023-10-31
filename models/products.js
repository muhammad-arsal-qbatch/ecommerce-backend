import mongoose from 'mongoose';

const products = mongoose.Schema(
  {
    productName: {
      type: String,
      required: true
    },
    size: Array,
    color: Array,
    price: {
      type: Number,
      required: true
    },
    quantity: {
      type: Number,
      required: true
    },
    images:Array,
    totalSold: {
      type: Number,
      default: 0
    },
    date: {
      type: Date,
      default: Date.now
    }

  }
)
const Product = mongoose.model('products', products,'products');

export default Product;