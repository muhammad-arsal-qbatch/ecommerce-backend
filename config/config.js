import stripe from 'stripe';
const {
    PORT,
    MONGO_URL,
} = process.env;

const secretKey = 'secretKey';
const emailSendUser = 'muhammadarsal236@gmail.com';
const emailSendPassword = 'etow excw lqel ajnr';
const stripeSecretKey = 'sk_test_51O52vmCQHxZ61BY0S1zaRQY2ZDooBaNNjrW4mm2w4gyijSAPzPp8dAEOyGOeGqY1QuF0w6ij8dxmTHDSni5FzpOR00z7hIEhky';
const stripePublishableKey = 'pk_test_51O52vmCQHxZ61BY0ok9Jh0IXyAGlYOYaxQMRasDqJbYDZ7s0z6yPxdh8X51OQKH1hNuPZ5ppf1MPtgScPtmT9Qpf00ACNIyRYH';

const stripeClient = stripe(stripeSecretKey);
const stripeClient2 = stripe(stripePublishableKey);


export {
    PORT,
    MONGO_URL,
    secretKey,
    emailSendUser,
    emailSendPassword,
    stripeSecretKey,
    stripePublishableKey,
    stripeClient,
    stripeClient2
}