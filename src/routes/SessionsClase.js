const { Router } = require("express");
const Auth = require('../auth');

const router = Router();

router.get('/', (req, res) => {
    if (!req.session.counter) {
        req.session.counter = 1; 
        res.send('Bienvenido cara de sapo')// Initialize the counter on the first visit
    } else {
        req.session.counter++; 
        res.send(`La cara de sapo ha visitado la página ${req.session.counter} veces`);
        // Increment the counter on subsequent visits
    }
});

router.get('/login', (req, res) => {
//construyo la session
const { username, password } = req.query

if(username !== 'pepeVeni' || password !== 'saltasalta') {
    return res.send ("no podes ingresar, vos no saltas como pepe")
}

req.session.user = username
req.session.admin = true
res.send("si sabes saltar pepe, pero para!")
})


router.get('/api/sessions', (req, res) => {
    //construyo la session
    const { username, password } = req.query
    
    if(username !== 'pepeVeni' || password !== 'saltasalta') {
        return res.send ("no podes ingresar, vos no saltas como pepe")
    }
    
    req.session.user = username
    req.session.admin = true
    res.send("si sabes saltar pepe, pero para!")
    })


    
router.get('/ruta-protegida', Auth, (req, res) => {
    // Si el middleware requireAuth pasa, significa que el usuario está autenticado
    res.send(`Bienvenido, ${req.session.user}! Has accedido a una ruta protegida.`);
});

