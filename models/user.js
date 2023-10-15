import mongoose from 'mongoose';

const user = mongoose.Schema({
    name: String,
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    mobileNo: String,
    deliveryAddress: {
        type: Array,
        default: []
    },
    paymentMethods: {
        type: Array,
        default: []
    },
    selectedPerson: {
        type: Number,
        default: 0
    },
    selectedPaymentMethod: {
        type: Number,
        default: 0
    }
})

const User = mongoose.model('users', user, 'users')

export default User;
