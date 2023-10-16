import passport from 'passport';
import jwt from 'passport-jwt';

import User from '../models/user';
import { secretKey } from './config';

const JwtStrategy = jwt.Strategy; // used to create a strategy
const ExtractJwt = jwt.ExtractJwt; // used to extract jwt

const opts = {
    jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey : secretKey
}

passport.use(
    new JwtStrategy(opts, async (jwtPayload, done) => {
    // Check if the token is valid and retrieve user information
    // jwtPayload will contain the decoded JWT payload
    // You can fetch the user from a database using jwtPayload.sub or other identifier
        console.log('jwt token is', jwtPayload.email);
        const user = await User.find({ email: jwtPayload.email });
        console.log({ user });
        if(user)
            return done(null, user);
        return done(null, false)


        // find user from db, if user found return true else false


    })
);


