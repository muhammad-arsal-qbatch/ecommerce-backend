import Orders from '../models/orders';
import User from '../models/user';

const PlaceOrder = async (order) => {
  try {
    const finalOrder = await GetFinalOrder(order);
    await Orders.insertMany(finalOrder);
    return finalOrder;
  } catch (error) {
    throw new Error(error.message);
  }
};

const GetOrders = async (userId, sortingObj) => {
  try {
    const orders = await Orders.find(userId).sort(sortingObj);

    return orders;
  } catch (error) {
    throw new Error('Error while fetching orders');
  }
};

const GetFinalOrder = async (order) => {
  try {
    const latestOrder = await Orders.findOne()
            .sort({ date: -1 })
            .select('orderId')
            .exec();
    if (latestOrder) {
      order.orderId = latestOrder.orderId + 1;
    } else {
      order.orderId = 100;
    }
    var totalAmount = 0;
    order.products.map((product) => {
      totalAmount += product.quantity * product.price;
    });
    order.totalAmount = totalAmount;

    return order;
  } catch (error) {
    throw new Error('Error While Fetching Orders');
  }
};

const DeliverOrder = async (order) => {
  try {
    const updatedOrder = await Orders.findOneAndUpdate(
            { orderId: order.orderId },
      {
        delivered: 'Delivered',
      },
            { new: true }
        );

    return updatedOrder;
  } catch (error) {
    throw new Error('Order cannot be delivered');
  }
};

const UpdateDeliveryAddress = async ({ userId, body }) => {
  const user = await User.findOne({ _id: userId });
  if (!user) {
    throw new Error('User not found');
  }
  user.selectedPerson = body;
  await user.save();

  return user;

};

export {
    PlaceOrder,
    GetOrders,
    GetFinalOrder,
    DeliverOrder,
    UpdateDeliveryAddress,
};
