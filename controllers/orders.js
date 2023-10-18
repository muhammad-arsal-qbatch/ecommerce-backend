import Orders from '../models/orders';
import User from '../models/user';

const PlaceOrder = async (order) => {
    try {
        console.log(order);
        const finalOrder = await GetFinalOrder(order);
        console.log({ finalOrder });
        await Orders.insertMany(finalOrder);

        return finalOrder;
    } catch (error) {
        console.log(error);
    }
};

const GetOrders = async (userId, sortingObj) => {
    try {
        console.log('use id in finals ,,, ', userId);
        const orders = await Orders.find(userId).sort(sortingObj);
        console.log('orderss in final areeee', orders);

        return orders;
    } catch (error) {
        console.log({ error });
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
        console.log(error);
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
const UpdatePaymentMethod = async ({ userId, body }) => {
    try {
        const user = await User.findOne({ _id: userId });
        if (!user) {
            return { error: 'User not found' };
        }
        user.selectedPaymentMethod = body;
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
    UpdatePaymentMethod,
};
