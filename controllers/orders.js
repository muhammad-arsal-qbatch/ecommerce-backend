import Orders from '../models/orders';
import User from '../models/userSchema';

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
        // console.log('user id is, ', userId);
        const orders= await Orders.find({userId: userId}, {productId: 0})
        // console.log({ orders })
        return orders;

    }catch(error){
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
                    totalAmount: {$addToSet: '$totalAmount'}, // Calculate total amount
                    status: {$addToSet: '$status'}, // Calculate total amount
                    delivered: {$addToSet: '$delivered'} // Calculate total amount

                }
            },
            {
                $project: {
                    _id: 0, // Exclude _id field from the result
                    orderId: '$_id', // Rename _id to orderId
                    totalQuantity: 1, // Include totalQuantity in the result
                    userName: 1, // Include usernames in the result
                    date: 1, // Include dates in the result
                    totalAmount: 1,
                    status: 1,
                    delivered: 1
                }
            }
        ]);

        // console.log('Grouped Orders:', orders);
        return {orders};


    } catch(error){
        console.log(error);
    }
}

const GetFinalOrder = async (order) => {
    try{
        const latestOrder = await Orders.findOne().sort({ date: -1 }).select('orderId').exec();
        console.log('latetst order is', latestOrder);
        if(latestOrder)
        {
            order.orderId = latestOrder.orderId+1;
        }
        else{
            order.orderId = 100;
        }
        // const finalOrder = order.map((o) => {
        //     o.orderId = latestOrder.orderId + 1;
        //     return o;
        var totalAmount = 0;
        order.products.map((product)=>{
            totalAmount+= (product.quantity * product.price);

        })
        order.totalAmount = totalAmount;


        // })
        return order;

    }catch(error){
        console.log(error);
    }
}
const DeliverOrder = async (order) => {
    console.log({order});
    try{
        const updatedOrder = await Orders.findOneAndUpdate(
            {orderId: order.orderId},
            {
                delivered: 'Delivered'
            },
            { new: true }
        )
        console.log({ updatedOrder })
        return updatedOrder;

    }catch(error){
        console.log(error);
        return { error }
    }
}
const UpdateDeliveryAddress = async ({ userId, body }) => {
    try{

        console.log('in update , ', body);
        const user = await User.findOne({ _id: userId });

        if (!user) {
            return { error: 'User not found' };
        }

        // Update the deliveryPerson field with the selectedAddress
        user.selectedPerson = body;

        // Save the updated user
        await user.save();
        return user;

    }catch(error){
        console.log(error);
        return { error }
    }
}



export { PlaceOrder,
    GetOrders,
    GetFinalOrder,
    GetOrdersInGroup,
    DeliverOrder,
    UpdateDeliveryAddress
};