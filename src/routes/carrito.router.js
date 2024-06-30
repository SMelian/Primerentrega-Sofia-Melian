const { Router } = require("express");
const CarritoManager = require("../CarritoManager");
const modeloProductos = require('../dao/models/productos.modelo'); // Adjust the path as needed
const modeloCart = require('../dao/models/cart.modelo');
const errors = require ('../errors');

const router = Router();
const cm = new CarritoManager();

/**
 * @swagger
 * components:
 *   schemas:
 *     Cart:
 *       type: object
 *       required:
 *         - title
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the cart
 *         title:
 *           type: string
 *           description: The title of the cart
 *         products:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               product:
 *                 $ref: '#/components/schemas/Product'
 *               quantity:
 *                 type: number
 *       example:
 *         id: d5fE_asz
 *         title: Cart title
 *         products:
 *           - product: d5fE_asz
 *             quantity: 2
 */

/**
 * @swagger
 * /carrito:
 *   get:
 *     summary: Returns a list of all carts
 *     tags: [Carts]
 *     responses:
 *       200:
 *         description: The list of carts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Cart'
 */

router.get('/', async (req, res) => {
    try {
        const cart = await cm.loadCartData();
        res.render('carrito', { pageTitle: 'Carrito de Compras', cart });
    } catch (error) {
        console.error('Error loading cart:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/:cartId', async (req, res, next) => {
    try {
        const cartId = req.params.cartId;
        const cart = await modeloCart.findById(cartId).populate('products.product').exec();
        
        if (!cart) throw new CustomError(errors.CART_NOT_FOUND);

        res.render('cartId', { pageTitle: 'Carrito Detalle', cart });
    } catch (error) {
        next(error); 
    }
});

router.post('/', async (req, res) => {
    try {
        const { cartId, productId, title } = req.body;
        await cm.addToCart(cartId, productId, title);
        res.sendStatus(200);
    } catch (error) {
        console.error('Error adding product to cart:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.delete('/', async (req, res) => {
    try {
        const result = await cm.deleteMany();
        if (result.deletedCount > 0) {
            res.status(200).json({ message: 'All carts have been deleted' });
        } else {
            res.status(404).json({ message: 'No carts found to delete' });
        }
    } catch (error) {
        console.error('Error deleting carts:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.delete('/:cartId/products/:productId', async (req, res) => {
    try {
        const { cartId, productId } = req.params;
        await cm.removeFromCart(cartId, productId);
        res.sendStatus(204);
    } catch (error) {
        console.error('Error removing product from cart:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.put('/:cartId', async (req, res) => {
    try {
        const cartId = req.params.cartId;
        const products = req.body.products; //
        await cm.updateCart(cartId, products);
        res.status(200).json({ message: "Cart updated successfully" });
    } catch (error) {
        console.error('Error updating cart:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
