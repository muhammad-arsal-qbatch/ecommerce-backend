import Orders from '../models/orders';

const UpdateOrderStatus = async ({ orderId }) => {
  try{
    await Orders.updateOne({ orderId: orderId }, {$set : { status: 'Paid' }});

  } catch (error) {
    throw new Error(error);
  }
}

export default UpdateOrderStatus