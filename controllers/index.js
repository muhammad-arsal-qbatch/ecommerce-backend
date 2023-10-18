import SignIn from './auth/sign-in';
import SignUp from './auth/sign-up';
import ForgotPassword from './auth/forgot-password';

import {
    AddDeliveryAddress,
    GetDeliveryAddress,
    GetAllDeliveryAddress,
    GetPaymentMethod,
    GetAllPaymentMethods,
    AddPaymentMethod
} from './delivery-person';

import {
    PlaceOrder,
    GetOrders,
    GetFinalOrder,
    DeliverOrder,
    UpdateDeliveryAddress,
    UpdatePaymentMethod
} from './orders';

import {
    AddProduct,
    GetProducts,
    DeleteProduct,
    EditProduct,
    UpdateProductQuantities,
    GetTopSellingProducts
} from './products';

export {
    SignIn,
    SignUp,
    ForgotPassword,
    AddDeliveryAddress,
    GetDeliveryAddress,
    GetAllDeliveryAddress,
    GetPaymentMethod,
    GetAllPaymentMethods,
    AddPaymentMethod,
    PlaceOrder,
    GetOrders,
    GetFinalOrder,
    DeliverOrder,
    UpdateDeliveryAddress,
    UpdatePaymentMethod,
    AddProduct,
    GetProducts,
    DeleteProduct,
    EditProduct,
    UpdateProductQuantities,
    GetTopSellingProducts
}
