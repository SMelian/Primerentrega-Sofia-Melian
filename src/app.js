const express = require("express");
const mongoose = require('mongoose');
const handlebars = require('express-handlebars');
const { Server } = require("socket.io");
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const initializePassport = require('./config/passport.config');
const logger = require('./logger'); 
const ProductManager = require("./ProductManager");
const CarritoManager = require("./CarritoManager");
const TicketOrden = require('./dao/models/orden.modelo');
const path = require("path"); 
const productRouter = require("./routes/products.router");
const carritoRouter = require("./routes/carrito.router");
const chatRouter = require("./routes/chat.router");
const realTimeProducts = require("./routes/realTimeProduct.router");
const sessionRouter = require('./routes/session.router');
const viewsRouter = require('./routes/views.router');
const ticketRouter = require('./routes/ticket.router'); 
const mockingProductsRouter = require('./routes/mockingProducts.router');
const loggerTestRouter = require('./routes/loggerTest.router'); 
const passwordResetRouter = require('./routes/passwordReset.router'); 
const usersRouter = require('./routes/user.router'); 

const cookieParser = require('cookie-parser');

const pm = new ProductManager("./productos.json");
const cm = new CarritoManager("./carrito.json");

const Mensaje = require('./dao/models/chat.modelo'); 

const config = require('./config/config');
const nodemailer = require('nodemailer');
const { ensureAuthenticated, ensureRole } = require('./config/auth.middleware');


const PORT = config.port;
let serverSocket;
const app = express();

// Debugging logs
console.log("Environment Variables:");
console.log("PORT:", config.port);
console.log("MONGO_URL:", config.mongoUrl);
console.log("ADMIN_NAME:", config.adminName);
console.log("ADMIN_PASSWORD:", config.adminPassword);

// Set up Handlebars view engine
app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser("EContraLjSlo")); //aca la "enchufo"

const storeOptions = {
    mongoUrl: config.mongoUrl,
    ttl: 15
};

app.use(session({
    store: MongoStore.create(storeOptions),
    secret: 'coderSecret',
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());
initializePassport(passport);

app.use("/api/productos", (req, res, next) => {
    req.io = io;
    next();
}, productRouter);

app.use('/productos', productRouter);
app.use('/realTimeProducts', realTimeProducts);
app.use('/carrito', carritoRouter); 
app.use('/chat', chatRouter); 
app.use('/', viewsRouter);
app.use('/api/session', sessionRouter);
app.use('/crear-ticket', ticketRouter);
app.use('/api', mockingProductsRouter);
app.use('/loggerTest', loggerTestRouter);
app.use('/api/password-reset', passwordResetRouter);
app.use('/api/users', usersRouter); 


let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: config.user, 
    pass: config.pass  
  },
});

app.get('/mail', async(req, res) => {
  try {
    let result = await transporter.sendMail({
      from: 'Test Melian <testmelian@gmail.com>',
      to: 'sofiabelen8989@gmail.com',
      subject: 'Correo test',
      html: '<h1>Hola test</h1>',
      attachments:[{
        filename: 'txt.txt',
        path:__dirname+'/txt.txt',
        cid:'perrito1'
      }]
    });

    res.status(200).send('Email sent successfully: ' + result.response);
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send('Error sending email: ' + error.message);
  }
});



const serverHttp = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

const connect = (async () => {
    try {
        await mongoose.connect(config.mongoUrl, { dbName: "eCommerce" });
    } catch (error) {
        console.log("hay un error en mongoose", error);
    }
});
connect();

const connection = mongoose.connection;

connection.once('open', () => {
    console.log('Conexión establecida con la base de datos MongoDB');
});

app.get('/setCookie', (req, res) => {
    res.cookie('CookieName', 'el valor de la cookie').send("Cookie");
});

app.get('/setSignedCookie', (req, res) => {
    res.cookie('CookieName', 'el valor de la cookie con Signature', { maxAge: 1000000, signed: true }).send("Cookie");
});

app.get('/getCookie', (req, res) => {
    res.send(req.cookies); // aca estaria accediendo a todas las cookies pero puedo acceder a una especifica si al final de esto agrego ".nombre de la cookie"
});

app.get('/deletetCookie', (req, res) => {
    res.clearCookie('CoderCookie').send('Cookie Removed'); // aca estaria accediendo a todas las cookies pero puedo acceder a una especifica si al final de esto agrego ".nombre de la cookie"
});

app.use((err, req, res, next) => {
    if (err instanceof CustomError) {
        res.status(err.statusCode).json({ error: err.message });
    } else {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
// Initialize Socket.io server
const io = new Server(serverHttp);

let mensajes = [];
let usuario = [];

// Handle WebSocket connections
io.on("connection", socket => {
    console.log(`A user connected ${socket.id}`);
    socket.on("presentation", nombre => {
        usuario.push({ id: socket.id, nombre });
        socket.emit("historial", mensajes);
        console.log(nombre);
        socket.broadcast.emit("nuevoUsuario", nombre);
    });

    socket.on("mensaje", async (nombre, mensaje) => {
        const nuevoMensaje = new Mensaje({ nombre, mensaje }); // Crea un nuevo mensaje utilizando el modelo Mongoose
        await nuevoMensaje.save() // Guarda el nuevo mensaje en la base de datos MongoDB
            .then(() => {
                io.emit("nuevoMensaje", nombre, mensaje);
            })
            .catch(error => {
                console.error("Error al guardar el nuevo mensaje:", error);
            });
    });
});
