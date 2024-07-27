const { Router } = require("express");
const Auth = require('../auth');

const router = Router();

router.get('/', (req, res) => {
    if (!req.session.counter) {
        req.session.counter = 1; 
        res.send('Bienvenido')
    } else {
        req.session.counter++; 
        res.send(`Ha visitado la página ${req.session.counter} veces`);
    }
});

router.get('/login', (req, res) => {
const { username, password } = req.query

if(username !== 'pepeVeni' || password !== 'saltasalta') {
    return res.send ("no podes ingresar, vos no saltas como pepe")
}

req.session.user = username
req.session.admin = true
res.send("si sabes saltar pepe, pero para!")
})


router.get('/api/sessions', (req, res) => {
  
    const { username, password } = req.query
    
    if(username !== 'pepeVeni' || password !== 'saltasalta') {
        return res.send ("no podes ingresar, vos no saltas como pepe")
    }
    
    req.session.user = username
    req.session.admin = true
    res.send("si sabes saltar pepe, pero para!")
    })


    
router.get('/ruta-protegida', Auth, (req, res) => {
    res.send(`Bienvenido, ${req.session.user}! Has accedido a una ruta protegida.`);
});

