const express = require("express");
const ProductManager = require("./ProductManager");
const CarritoManager = require("./CarritoManager");

const PORT = 8080;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const productRouter = require("./routes/products.router");
const carritoRouter = require("./routes/carrito.router");
const pm = new ProductManager("./productos.json");
const cm = new CarritoManager("./carrito.json");

app.get('/', (req, res) => {
  res.send('<h1 style="color:green;"> Bienvenido a mi intento :)</h1> <h2> 1. En el buscador escribi /Products para ver el listado de todos los productos o <br> 2. Products/id para ver un productos en especifico</h2>')
});

app.use('/products', productRouter);
//app.use('/api//products', productRouter);
app.use('/carrito', carritoRouter); 

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
