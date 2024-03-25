const { Router } = require("express");
const ProductManager = require("../ProductManager"); 

const router = Router();

const pm = new ProductManager(); 


router.get('/', async (req, res) => {
  try {
      let productos = await pm.getProducts();
      let limit = req.query.limit;
      if (limit && limit > 0) {
          productos = productos.slice(0, limit);
      }
      res.render('realTimeProducts', { pageTitle: 'Lista de Productos', productos }); // Render the 'index' view with the list of products
  } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
  }
});

  router.post('/', async (req, res) => {
    try {
        const { title, description, code, price, status, stock, category, thumbnails } = req.body;
        if (!title || !description || !code || !price || !status || !stock || !category || !thumbnails) {
            return res.status(400).json({ error: "All fields are required" });
        }
        const newProduct = await pm.addProduct(title, description, code, price, status, stock, category, thumbnails);
        //res.status(201).json(newProduct);
        req.io.emit("NewProduct",newProduct)
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});
module.exports = router;