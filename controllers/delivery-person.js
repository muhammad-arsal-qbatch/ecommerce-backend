import User from '../models/userSchema';

const AddDeliveryAddress = async (body) =>{
    try {
        console.log('body in last fun is, ', body)
        const deliveryPerson = {
            name: body.fullName,
            mobileNo: body.mobileNo,
            province: body.province,
            city: body.city,
            address: body.address,
            country: body.country,


        };
        console.log('delivery person, ', deliveryPerson)
        console.log('user id is , ', body.userId)
        const singleUser = await User.findOne({_id: body.userId });
        console.log('single user is, ', singleUser);
        singleUser.deliveryAddress.push(deliveryPerson);
        await singleUser.save();
        return singleUser.deliveryAddress;
    } catch(err) {
        throw new Error(err);
    }

}

const AddPaymentMethod = async (body) =>{
    try {
        console.log('inside add payment method functionnn, ', body)
        const paymentMethod = {
            cardNumber: body.cardNumber,
            expiryDate: body.expiryDate,
            cvc: body.cvc,
            country: body.country,
        };
        console.log('payment method is ', paymentMethod)
        console.log('user id is , ', body.userId)
        const singleUser = await User.findOne({_id: body.userId });
        console.log('single user is, ', singleUser);
        singleUser.paymentMethods.push(paymentMethod);
        console.log(' single user after push is , ', singleUser);
        await singleUser.save();
        return singleUser.paymentMethods;
    } catch(err) {
        throw new Error(err);
    }

}


// const AddDeliveryPerson = async (userId)=> {
//     try{
//         const newDeliveryPerson = new DeliveryPerson({
//             userId: userId,
//             persons: [],
//             selectedPerson: 0
//         });

//         await newDeliveryPerson.save();


//     }catch(err) {
//         throw new Error(err);
//     }
// }
const GetDeliveryAddress = async ({ userId })=> {
    try{
        // console.log('inside get delivery address',userId);
        const user = await User.findOne({ _id: { $in: userId }});
        // console.log('person is ;', user.deliveryAddress[user.selectedPerson]);
        return user.deliveryAddress[user.selectedPerson];



    }catch(err) {
        throw new Error(err);
    }
}
const GetPaymentMethod = async ({ userId })=> {
    try{
        console.log('inside single payment method',userId);
        const user = await User.findOne({ _id: { $in: userId }});
        // console.log('person is ;', user.deliveryAddress[user.selectedPerson]);
        return user.paymentMethods[user.selectedPaymentMethod];



    }catch(err) {
        throw new Error(err);
    }
}
const GetAllDeliveryAddress = async ({ userId })=> {
    try{
        console.log('inside get delivery address',userId);
        const user = await User.findOne({ _id: { $in: userId }});
        // console.log('person is ;', user.deliveryAddress[user.selectedPerson]);
        return user.deliveryAddress;



    }catch(err) {
        throw new Error(err);
    }
}

const GetAllPaymentMethods = async ({ userId })=> {
    try{
        console.log('inside get all payment method',userId);
        const user = await User.findOne({ _id: { $in: userId }});
        // console.log('person is ;', user.deliveryAddress[user.selectedPerson]);
        return user.paymentMethods;



    }catch(err) {
        throw new Error(err);
    }
}

export {
    AddDeliveryAddress,
    GetDeliveryAddress,
    GetAllDeliveryAddress,
    GetPaymentMethod,
    GetAllPaymentMethods,
    AddPaymentMethod
};
