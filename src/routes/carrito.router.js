const { Router } = require("express");
const CarritoManager = require("../CarritoManager");

const router = Router();
const cm = new CarritoManager();

router.get('/', (req, res) => {
    const cart = cm.getCart();
    res.json(cart);
});
router.get('/:cid', (req, res) => {
    const cartId = req.params.cid;
    res.json(productosDelCarrito);
});

router.post('/:cid/product/:pid', (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.cid;

        // esto deberia agregar el producto al carrito (creo)
        cm.addProductToCart(cartId, productId);

        res.status(201).json({ message: "Product added to cart" });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.delete('/:id/eliminar', (req, res) => {
    const productId = req.params.id;

    // Eliminar el produ
    cm.removeFromCart(productId);

    res.status(204).send();
});

module.exports = router;
