const { Router } = require("express");
const CarritoManager = require("../CarritoManager");

const router = Router();
const cm = new CarritoManager();

router.get('/', (req, res) => {
    const cart = cm.loadCartData();
    res.render('carrito', { pageTitle: 'Carrito de Compras', cart });
});
router.get('/:cartId', async (req, res) => {
    
    try {
        const cartId = req.params.cartId;
        const cart = await cm.loadCartData(cartId);

        if (!cart) {
            return res.status(404).json({ error: "Product not found" });
          }
          res.render('cartId', { pageTitle: 'Producto elegido', cart }); // Render the 'index' view with the list of products
         
        } catch (error) {
          res.status(500).json({ error: "Internal Server Error" });
        }
      })

router.post('/:productId', (req, res) => {
    
    try {
        const productId = req.params.productId;
        // Agregar el producto al carrito
        cm.addToCart(productId);
        
        // Respuesta exitosa
        res.sendStatus(200);
    } catch (error) {
        //  errores
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
