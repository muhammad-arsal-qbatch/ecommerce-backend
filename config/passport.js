import passport from 'passport';
import jwt from 'passport-jwt';

import { secretKey } from './config';

const JwtStrategy = jwt.Strategy; // used to create a strategy
const ExtractJwt = jwt.ExtractJwt; // used to extract jwt

const opts = {
    jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey : secretKey
}

passport.use(
    new JwtStrategy(opts, (jwtPayload, done) => {
    // Check if the token is valid and retrieve user information
    // jwtPayload will contain the decoded JWT payload
    // You can fetch the user from a database using jwtPayload.sub or other identifier

        // find user from db, if user found return true else false
        return done(null, true);


    })
);


