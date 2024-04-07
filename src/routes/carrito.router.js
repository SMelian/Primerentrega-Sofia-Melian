const { Router } = require("express");
const CarritoManager = require("../CarritoManager");
const ProductManager = require('../ProductManager');
const modeloProductos = require('../dao/models/productos.modelo'); // Adjust the path as needed
const modeloCart = require ('../dao/models/cart.modelo')

const router = Router();
const cm = new CarritoManager();
const pm = new ProductManager();

router.get('/', async (req, res) => {
    const cart = await cm.loadCartData();
    res.render('carrito', { pageTitle: 'Carrito de Compras', cart });
});
router.get('/:cartId', async (req, res) => {
    
    try {
        const cartId = req.params.cartId;
        const product = await modeloCart.findById(cartId).lean();
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
          }
      
          const cart = await cm.loadCartData();

          res.render('cartId', { pageTitle: 'Producto elegido', cart });
        } catch (error) {
          console.error("Error al obtener el producto:", error);
          res.status(500).json({ error: "Internal Server Error" });
        }
      });

router.post('/:productId', async (req, res) => {
    
    try {
        const productId = req.params.productId;
        const product = await modeloProductos.findById(productId).select('title description');
        
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }
        
        // Agregar el producto al carrito
        cm.addToCart(product);
        
        // Respuesta exitosa
        res.sendStatus(200);
         } catch (error) {
        console.error('Error al agregar el producto al carrito:', error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});


router.delete('/', async (req, res) => {
    try {
        // eliminación masiva
        const resultado = await cm.deleteMany({});

        // Verifica si se eliminaron todos 
        if (resultado.deletedCount > 0) {
            res.status(200).json({ message: 'Todos los carritos han sido eliminados' });
        } else {
            res.status(404).json({ message: 'No se encontraron carritos para eliminar' });
        }
    } catch (error) {
        console.error('Error al eliminar carritos:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});


router.delete('/:cid/products', async (req, res) => {
    try {
        const cartId = req.params.cid;
        //const productId = req.params.pid;

        // Remove the product from the cart
        await cm.removeFromCart(cartId);

        res.status(204).send();
    } catch (error) {
        console.error('Error removing product from cart:', error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.put('/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const products = req.body.products; // Assuming the request body contains an array of products

        // Update the cart with the provided array of products
        await cm.updateCart(cartId, products);

        res.status(200).json({ message: "Cart updated successfully" });
    } catch (error) {
        console.error('Error updating cart:', error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
