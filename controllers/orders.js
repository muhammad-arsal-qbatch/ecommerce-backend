import Orders from '../models/orders';
import User from '../models/user';

const PlaceOrder = async (order) => {
  try {
    const finalOrder = await GetFinalOrder(order);
    await Orders.insertMany(finalOrder);

    return finalOrder;
  } catch (error) { /* empty */ }
};

const GetOrders = async (userId, sortingObj) => {
  try {
    const orders = await Orders.find(userId).sort(sortingObj);

    return orders;
  } catch (error) { /* empty */ }
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
  } catch (error) { /* empty */ }
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
  try {
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return { error: 'User not found' };
    }
    user.selectedPerson = body;
    await user.save();

    return user;
  } catch (error) {
    return { error };
  }
};

export {
    PlaceOrder,
    GetOrders,
    GetFinalOrder,
    DeliverOrder,
    UpdateDeliveryAddress,
};
