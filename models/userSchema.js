import mongoose from "mongoose";

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
})

const User = mongoose.model('users', user, 'users')

export default User;
