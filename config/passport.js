  import passport from 'passport';
  import jwt from 'passport-jwt';

  import User from '../models/user';
  import { secretKey } from './config';

  const JwtStrategy = jwt.Strategy;
  const ExtractJwt = jwt.ExtractJwt;

  const opts = {
    jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey : secretKey
  }

  passport.use(
      new JwtStrategy(opts, async (jwtPayload, done) => {

        const user = await User.find({ email: jwtPayload.email });
        if(user)
          return done(null, user);
        return done(null, false);
      })
  );


