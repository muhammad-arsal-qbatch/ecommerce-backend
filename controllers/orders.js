import Orders from '../models/orders';
import User from '../models/user';

const PlaceOrder = async (order) => {
    try{
        console.log(order);
        const finalOrder = await GetFinalOrder(order);
        console.log({ finalOrder });
        await Orders.insertMany(finalOrder);

        return finalOrder;
    }catch(error) {
        console.log(error)
    }
}

const GetOrders = async ({ userId }) => {
    try{
        const orders = await Orders.find({ userId: userId }, { productId: 0 });

        return orders;
    } catch(error) {
        console.log({ error });
    }
}
const GetOrdersInGroup = async () => {
    try{
        const orders = await Orders.aggregate([
            {
                $group: {
                    _id: '$orderId',
                    totalQuantity: { $sum: '$totalQuantity' },
                    userName: { $addToSet: '$userName' },
                    date: { $addToSet: '$date' },
                    totalAmount: { $addToSet: '$totalAmount' },
                    status: { $addToSet: '$status' },
                    delivered: { $addToSet: '$delivered' }
                }
            },
            {
                $project: {
                    _id: 0,
                    orderId: '$_id',
                    totalQuantity: 1,
                    userName: 1,
                    date: 1,
                    totalAmount: 1,
                    status: 1,
                    delivered: 1
                }
            }
        ]);

        return {orders};
    } catch(error) {
        throw new Error('error while fetching orderss');
    }
}

const GetFinalOrder = async (order) => {
    try{
        const latestOrder = await Orders.findOne().sort({ date: -1 }).select('orderId').exec();
        if(latestOrder)
        {
            order.orderId = latestOrder.orderId+1;
        }
        else{
            order.orderId = 100;
        }
        var totalAmount = 0;
        order.products.map((product) => {
            totalAmount += (product.quantity * product.price);
        })
        order.totalAmount = totalAmount;

        return order;
    } catch(error) {
        console.log(error);
    }
}

const DeliverOrder = async (order) => {
    try{
        const updatedOrder = await Orders.findOneAndUpdate(
            { orderId: order.orderId },
            {
                delivered: 'Delivered'
            },
            { new: true }
        )

        return updatedOrder;
    } catch(error) {
        throw new Error('Order cannot be delivered');
    }
}

const UpdateDeliveryAddress = async ({ userId, body }) => {
    try{
        const user = await User.findOne({ _id: userId });
        if (!user) {
            return { error: 'User not found' };
        }
        user.selectedPerson = body;
        await user.save();

        return user;
    } catch(error) {
        return { error };
    }
}

export { 
    PlaceOrder,
    GetOrders,
    GetFinalOrder,
    GetOrdersInGroup,
    DeliverOrder,
    UpdateDeliveryAddress
};