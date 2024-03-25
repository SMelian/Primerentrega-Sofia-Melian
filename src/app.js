const express = require("express");
const mongoose = require('mongoose');
const handlebars = require('express-handlebars');
const {Server} = require ("socket.io");
const ProductManager = require("./ProductManager");
const CarritoManager = require("./CarritoManager");
const path = require("path"); 
const productRouter = require("./routes/products.router");
const carritoRouter = require("./routes/carrito.router");
const chatRouter = require("./routes/chat.router");
const realTimeProducts = require("./routes/realTimeproduct.router");

const pm = new ProductManager("./productos.json");
const cm = new CarritoManager("./carrito.json");

const PORT = 8080;
let serverSocket;
const app = express();
 


// Set up Handlebars view engine
//app.engine("handlebars", handlebars());
app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname,"public")));



app.use("/api/productos", (req, res, next) => {
  req.io = io;
  next();
}, productRouter);

app.use("/Products",productRouter);
app.use('/carrito', carritoRouter); 
app.use('/chat', chatRouter); 
app.use('/realTimeProducts', realTimeProducts);


const connect = (async ()=>{
  try {
    await  mongoose.connect('mongodb+srv://sofiamelian:40812518@cluster0.b4psxss.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',{
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true, // chat gtp
    }); 
  } catch(error) {
 console.log ("hay un error en mongoose",error)
  }
});
connect();

const connection = mongoose.connection;

connection.once('open', () => {
  console.log('Conexión establecida con la base de datos MongoDB');
});
 
const serverHttp = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Initialize Socket.io server
const io = new Server(serverHttp);

let mensajes = []
let usuario = []
// Handle WebSocket connections
io.on("connection", socket => {
  console.log(`A user connected ${socket.id}`);
  // You can add your WebSocket logic here
  socket.on("presentation", nombre=>{
    usuario.push({id: socket.id,nombre})
    socket.emit("historial",mensajes)
    console.log(nombre)
    socket.broadcast.emit("nuevoUsuario", nombre)
  

  })

  socket.on("mensaje",(nombre,mensaje)=>{
     mensajes.push({nombre,mensaje})
     io.emit("nuevoMensaje",nombre,mensaje)

  })

})

