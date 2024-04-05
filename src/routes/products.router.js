const { Router } = require("express");
const ProductManager = require("../ProductManager"); //me faltaba esto la entrega anterior

const router = Router();

const pm = new ProductManager(); // instancia - "./productos.json"

// router.get('/Products', async (req, res) => {
//     try {
//       let productos = await pm.getProducts();
//       let limit = req.query.limit;
//       if (limit && limit > 0) {
//         productos = productos.slice(0, limit);
//       }
      
//       //res.json(productos);
//       res.render('index', { pageTitle: 'Lista de Productos', productos }); //render para que muestre productos como listado

//     } catch (error) {
//       res.status(500).json({ error: "Internal Server Error" });
//     }
//   });

router.get('/', async (req, res) => {
  try {
      let productos = await pm.getProducts();
      let limit = req.query.limit;
      if (limit && limit > 0) {
          productos = productos.slice(0, limit);
      }
      res.render('index', { pageTitle: 'Lista de Productos', productos }); // Render the 'index' view with the list of products
  } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get('/:productId', async (req, res) => {
    try {
      const productId = req.params.productId;
      const product = await pm.getProductById(productId);
      
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.render('product', { pageTitle: 'Producto elegido', product }); // Render the 'index' view with the list of products
     
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  })

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

router.post('/api/productos', async (req, res) => {
    try {
        const { title, description, price, thumbnail, code, stock} = req.body;

        // llama al método addProduct de tu ProductManager para agregar el producto
        await pm.addProduct(title, description, price, thumbnail, code, stock);

        res.status(201).json({ message: "Producto agregado correctamente" });
    } catch (error) {
        // Manejar errores
        console.error('Error al agregar el producto:', error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

 router.put('/:id', async (req, res) => {
    try {
        const productId = req.params.id;
        const updatedFields = req.body;
        
     
        const existingProduct = await pm.getProductById(productId);
        if (!existingProduct) {
            return res.status(404).json({ error: "Product not found" });
        }

        
        await pm.updateProduct(productId, updatedFields);

     
        const updatedProduct = await pm.getProductById(productId);

        res.json(updatedProduct);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const productId = req.params.id;

//verifica si el producto esta en el array
        const existingProduct = await pm.getProductById(productId);
        if (!existingProduct) {
            return res.status(404).json({ error: "Product not found" });
        }
        await pm.deleteProduct(productId);

        res.status(204).send(); 
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});



module.exports = router;

