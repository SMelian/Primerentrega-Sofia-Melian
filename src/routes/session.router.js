const { Router } = require("express");
const Auth = require('../auth');
const passport = require("passport");
const User = require('../dao/models/User.modelo');
const { createHash, isValidPassword } = require('../utils');


const router = Router();

router.get('/', async (req, res) => {
   
        res.render('register');
 
});

router.post('/register',passport.authenticate('register',{failureRedirect:'/failregister'}),async (req,res)=> {
    res.redirect('/api/session/login');
})

router.get('/failregister', async(req,res)=>{
    console.log('Fallo Strategy');
    res.send({error:"failed"})
})

router.post('/github',passport.authenticate('github',{scope:['user:email']}),async (req,res)=> {})

router.post('/githubcallback',passport.authenticate('github',{failureRedirect:'/login'}),async (req,res)=> {})


router.get ('/login', async (req, res) => {
   
    res.render('login');

});

router.get('/adminUser', Auth, (req, res) => {
    res.render('adminUser', { pageTitle: 'Admin User Page' });
});


router.post('/login', passport.authenticate('login', { failureRedirect: '/faillogin' }), async (req, res) => {
  if (!req.user) return res.status(400).send({status:"error", error:"Credenciales no correctas"})
  req.session.user = {
    email:req.user.email,
    }

    res.redirect('/productos');

});

router.get('/faillogin', async(req,res)=>{
    console.log('Fallo Strategy');
    res.send({error:"fallo login"})
})


router.get('/forgot-password', (req, res) => {
    res.render('forgot-password'); 
});

router.post('/reset-password', async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            throw new Error('Usuario no encontrado');
        }

        res.redirect('/api/session/register');
    } catch (error) {
        res.status(400).send(error.message);
    }
});



router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Error destroying session:', err);
            res.status(500).send('Internal Server Error');
        } else {
            res.redirect('/api/session/login'); 
        }
    });
});




module.exports = router;
