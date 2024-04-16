const { Router } = require("express");
const Auth = require('../auth');
const User = require('../dao/models/User.modelo');
const { createHash, isValidPassword } = require('../utils');


const router = Router();

router.get('/', async (req, res) => {
   
        res.render('registro');
 
});
// Ruta para el registro de usuario - intento
router.post('/', async (req, res) => {
    try {
        const { first_name, last_name, email, age, password } = req.body;
        if ( !first_name || !last_name || !email || !age || !password )return res.status(400).send(error.message);
        const hashedPassword = await createHash(password);

        console.log('Hashed password:', hashedPassword);
        
        
        const user = new User({ first_name, last_name, email, age, password:hashedPassword });
        await user.save();
        //res.send('Usuario registrado exitosamente');
        res.redirect('/api/session/login');
    } catch (error) {
        res.status(400).send(error.message);
    }
});


router.get ('/login', async (req, res) => {
   
    res.render('login');

});

router.get('/adminUser', Auth, (req, res) => {
    res.render('adminUser', { pageTitle: 'Admin User Page' });
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        //verifica lo de coderAdmin
        if (email === 'adminCoder@coder.com' && password === 'Cod3r123') {
            // Redireccionar al panel de administrador
            return res.redirect('/api/session/adminUser');
        }
        
  

        const user = await User.findOne({ email });
        if (!user) {
            throw new Error('Usuario no encontrado');
        }

        // Log the retrieved user and hashed password
        console.log('Retrieved user:', user);
        console.log('Retrieved hashed password:', user.password);

        // Check if the password is valid
        const isPasswordValid = await isValidPassword(password, user.password);
        console.log('Is password valid?', isPasswordValid);

        if (!isPasswordValid) {
            throw new Error('Credenciales incorrectas');
        }

        // Establecer el objeto user en req.session
        req.session.user = user;

        //res.send('Inicio de sesión exitoso'); si lo pongo me tira error. no se puede poner dos http res
        res.redirect('/productos');
    } catch (error) {
        res.status(400).send(error.message);
    }
});





router.get('/logout', (req, res) => {
    // Destroy the session
    req.session.destroy(err => {
        if (err) {
            console.error('Error destroying session:', err);
            res.status(500).send('Internal Server Error');
        } else {
            res.redirect('/api/session/login');; // Redirect to home page after logout
        }
    });
});




module.exports = router;
