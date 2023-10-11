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
    thumbnail:String

  }
)
const Product = mongoose.model('products', products,'products');
export default Product;