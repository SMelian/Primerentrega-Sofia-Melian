const express = require("express");
const handlebars = require('express-handlebars');
const {Server} = require ("socket.io")

const ProductManager = require("./ProductManager");
const CarritoManager = require("./CarritoManager");
const path = require("path"); 


const PORT = 8080;
let io;
const app = express();

// Set up Handlebars view engine
app.engine("handlebars", handlebars());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname,"public")));

const productRouter = require("./routes/products.router");
const carritoRouter = require("./routes/carrito.router");
const pm = new ProductManager("./productos.json");
const cm = new CarritoManager("./carrito.json");

app.use("/api/productos", (req, res, next) => {
  req.io = io;
  next();
}, productRouter);

app.use('/carrito', carritoRouter); 

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

io = new Server(Server);
