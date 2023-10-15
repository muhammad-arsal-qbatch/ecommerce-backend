import mongoose from 'mongoose';

const deliveryPerson = mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    persons: {
        type: Array,
        default: []
    },
    selectedPerson: {
        type: Number,
        default: 0
    }
})
const DeliveryPerson = mongoose.model('deliveryPerson', deliveryPerson, 'deliveryPerson');

export default DeliveryPerson;

