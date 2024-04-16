const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../dao/models/User.modelo');
const { createHash, isValidPassword } = require('../utils');

const initializePassport = () => {
    passport.use('register',new LocalStrategy(
        { passReqToCallback: true, usernameField: 'email' },
        async (req, email, password, done) => {
            try {
                // Check if the user exists
                let user = await User.findOne({ email });
                if (user) {
                    console.log("User already exists");
                    return done(null, false);
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
                return done("Error al obtener el usuario: " + error);
            }
        }
    ));


    //se usa para que no traiga al user anterior
    passport.serializeUser((user,done) =>{
        done (null,user._id);
    });
    passport.deserializeUser(async(id,done)=>{
        let user = await User.findById(id);
        done(null,user);
    });

    //login
    passport.use('login', new LocalStrategy(
        { passReqToCallback: true, usernameField: 'email' },
        async (req, username, password, done) => {
            try {
                // Find the user by email - intento1
                const user = await User.findOne({ email:username });
    
                // If user not found or password doesn't match, devuelve error
                const isPasswordValid = await isValidPassword(password, user.password);
                if (!isPasswordValid)  {
                    return done(null, false, { message: 'Usuario o contraseña incorrectos' });
                }
    
                // If user found and password matches, devuelve error
                return done(null, user);
            } catch (error) {
                return done(error);
            }
        }
    ));
    
};




module.exports = initializePassport;
