const { Router } = require("express");
const Auth = require('../auth');
const ProductManager = require("../ProductManager"); //me faltaba esto la entrega anterior


const router = Router();

const pm = new ProductManager(); // instancia - "./productos.json"


router.get('/',Auth, async (req, res) => {
    try {

        let usuario = req.session.user
        // let { limit = 10, page = 1, sort, query } = req.query;
        let { limit = 10, page = 1, query } = req.query;

        limit = parseInt(limit);
        page = parseInt(page);

        const options = {
            limit: limit,
            page: page,
           // sort: sort ? JSON.parse(sort) : { createdAt: -1 } 
        };

    
        const products = await pm.getProducts(options);
        console.log(products);

        // pagina actual
        const currentPageProducts = products.docs;

        // Calculo de detalles
        const totalPages = products.totalPages;
        const prevPage = page > 1 ? page - 1 : null;
        const nextPage = page < totalPages ? page + 1 : null;
        const hasPrevPage = page > 1;
        const hasNextPage = page < totalPages;


        res.render('index', {
            usuario,
            pageTitle: 'Lista de Productos',
            productos: currentPageProducts,
            totalPages: totalPages,
            prevPage: prevPage,
            nextPage: nextPage,
            page: page,
            hasPrevPage: hasPrevPage,
            hasNextPage: hasNextPage
        });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});




router.get('/:productId', Auth, async (req, res) => {
    try {
      const productId = req.params.productId;
      const product = await pm.getProductById(productId);
      
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.render('productoId', { pageTitle: 'Producto elegido', product });
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  })

  router.post('/', Auth, async (req, res) => {
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

router.post('/api/productos',Auth, async (req, res) => {
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

 router.put('/:id', Auth, async (req, res) => {
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

