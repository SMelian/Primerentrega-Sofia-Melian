const express = require("express");
const ProductManager = require("../ProductManager");

const PORT = 3000;
const app = express();
const pm = new ProductManager("./productos.json"); 

app.get('/', (req, res) => {
  res.send('<h1 style="color:green;"> Bienvenido a mi intento :)</h1> <h2> 1. En el buscador escribi /Products para ver el listado de todos los productos o <br> 2. Products/id para ver un productos en especifico</h2>')
})

app.get('/Products', async (req, res) => {
  try {
    let productos = await pm.getProducts();
    let limit = req.query.limit;
    if (limit && limit > 0) {
      productos = productos.slice(0, limit);
    }
    res.json(productos);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// app.get('/Products/:id', async (req, res) => {
//   try {
//     let productos = await pm.getProductById();
//     res.json(producto);
//   } catch (error) {
//     res.status(500).json({ error: "Ese ID no existe" });
//   }
// });

app.get('/Products/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await pm.getProductById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
