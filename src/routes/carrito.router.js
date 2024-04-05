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

router.delete('/:id/eliminar', (req, res) => {
    const productId = req.params.id;

    // Eliminar el producto
    cm.removeFromCart(productId);

    res.status(204).send();
});

module.exports = router;
