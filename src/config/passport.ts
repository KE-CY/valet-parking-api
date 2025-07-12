import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { UserService } from '../services/internal/userService';
import { User } from '../entities/User';


// Username and Password Login
passport.use(
  new LocalStrategy(async (username, password, done) => {
    const user = await UserService.loginLocalStrategy(username, password);
    return done(null, user);
  })
)

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user as User));
