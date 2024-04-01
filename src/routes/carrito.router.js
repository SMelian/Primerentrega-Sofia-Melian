const { Router } = require("express");
const CarritoManager = require("../CarritoManager");

const router = Router();
const cm = new CarritoManager();

router.get('/', (req, res) => {
    const cart = cm.loadCartData();
    res.render('carrito', { pageTitle: 'Carrito de Compras', cart });
});
router.get('/:cid', (req, res) => {
    const cartId = req.params.cid;
    res.json(productosDelCarrito);
});

router.post('/api/cart/add/:productId', (req, res) => {
    const productId = req.params.productId;

    try {
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
