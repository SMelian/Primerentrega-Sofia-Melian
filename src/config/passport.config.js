const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GithubStrategy = require('passport-github2').Strategy;
const User = require('../dao/models/User.modelo');
const { createHash, isValidPassword } = require('../utils');

const initializePassport = () => {
    passport.use('github', new GithubStrategy({
        clientID: "Iv1.f2ea916b3f005b55",
        clientSecret: "8b3bf1e0f378c082e103b2d999f3c9dbffbdcdd0",
        callbackURL: "http://localhost:8080/api/session/githubcallback"
    },
    async (accessToken, refreshToken, profile, done) => {
        try {
            console.log(profile);
            let user = await User.findOne({ email: profile._json.email });
            if (!user) {
                // If the user doesn't exist, create a new one
                const newUser = new User({
                    first_name: profile._json.first_name,
                    last_name: profile._json.last_name,
                    email: profile._json.email,
                    age: profile._json.age,
                });
                const result = await newUser.save();
                return done(null, result);
            } else {
                // If the user exists, simply return the found user
                return done(null, user);
            }
        } catch (error) {
            return done(error);
        }
    }));

    // Register strategy
    passport.use('register', new LocalStrategy(
        { passReqToCallback: true, usernameField: 'email' },
        async (req, email, password, done) => {
            try {
                // Check if the user exists
                let user = await User.findOne({ email });
                if (user) {
                    console.log("User already exists");
                    return done(null, false, { message: 'User already exists' });
                }

                // Hash the password
                const hashedPassword = await createHash(password);

                // Create a new user
                const newUser = new User({
                    first_name: req.body.first_name,
                    last_name: req.body.last_name,
                    email,
                    age: req.body.age,
                    password: hashedPassword
                });

                // Save the new user
                const result = await newUser.save();
                return done(null, result);
            } catch (error) {
                return done(error);
            }
        }
    ));

    // Login strategy
    passport.use('login', new LocalStrategy(
        { passReqToCallback: true, usernameField: 'email' },
        async (req, email, password, done) => {
            try {
                // Find the user by email
                const user = await User.findOne({ email });

                // If user not found or password doesn't match, return error
                if (!user) {
                    return done(null, false, { message: 'Incorrect email' });
                }

                const isPasswordValid = await isValidPassword(password, user.password);
                if (!isPasswordValid) {
                    return done(null, false, { message: 'Incorrect password' });
                }

                // If user found and password matches, return user
                return done(null, user);
            } catch (error) {
                return done(error);
            }
        }
    ));

    // Serialize and deserialize user
    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (error) {
            done(error);
        }
    });
};

module.exports = initializePassport;
