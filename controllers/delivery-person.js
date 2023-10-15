import User from '../models/user';

const AddDeliveryAddress = async (body) => {
    try {
        const deliveryPerson = {
            name: body.fullName,
            mobileNo: body.mobileNo,
            province: body.province,
            city: body.city,
            address: body.address,
            country: body.country,
        };
        const singleUser = await User.findOne({ _id: body.userId });
        singleUser.deliveryAddress.push(deliveryPerson);
        await singleUser.save();

        return singleUser.deliveryAddress;
    } catch(err) {
        throw new Error(err);
    }
}

const AddPaymentMethod = async (body) => {
    try {
        const paymentMethod = {
            cardNumber: body.cardNumber,
            expiryDate: body.expiryDate,
            cvc: body.cvc,
            country: body.country,
        };
        const singleUser = await User.findOne({ _id: body.userId });
        singleUser.paymentMethods.push(paymentMethod);
        await singleUser.save();

        return singleUser.paymentMethods;
    } catch(err) {
        throw new Error(err);
    }
}

const GetDeliveryAddress = async ({ userId }) => {
    try{
        const user = await User.findOne({ _id: { $in: userId } });

        return user.deliveryAddress[user.selectedPerson];
    } catch(err) {
        throw new Error(err);
    }
}

const GetPaymentMethod = async ({ userId }) => {
    try{
        const user = await User.findOne({ _id: { $in: userId } });

        return user.paymentMethods[user.selectedPaymentMethod];
    } catch(err) {
        throw new Error(err);
    }
}

const GetAllDeliveryAddress = async ({ userId }) => {
    try{
        const user = await User.findOne({ _id: { $in: userId } });

        return user.deliveryAddress;
    } catch(err) {
        throw new Error(err);
    }
}

const GetAllPaymentMethods = async ({ userId }) => {
    try{
        const user = await User.findOne({ _id: { $in: userId } });

        return user.paymentMethods;
    } catch (err) {
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
