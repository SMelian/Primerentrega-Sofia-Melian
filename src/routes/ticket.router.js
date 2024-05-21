const { Router } = require("express");
const User = require('../dao/models/User.modelo'); 
const Cart = require('../dao/models/cart.modelo'); 
const TicketOrden = require('../dao/models/orden.modelo'); 

const router = Router();

router.post('/', async (req, res) => {
    const { userId, numeroOrden, negocio } = req.body;

    try {
        const usuario = await User.findById(userId).populate('cartId');
        if (!usuario) throw new Error('Usuario no encontrado');

        const carrito = await Cart.findById(usuario.cartId).populate('products');
        if (!carrito) throw new Error('Carrito no encontrado');

        const productos = carrito.products.map(producto => producto.name);

        const nuevoTicket = new TicketOrden({
            numeroOrden,
            negocio,
            usuario: userId,
            productos
        });

        await nuevoTicket.save();
        res.status(201).json({ message: 'Ticket de orden generado con éxito', ticket: nuevoTicket });
    } catch (error) {
        res.status(500).json({ message: 'Error al generar el ticket de orden', error: error.message });
    }
});

module.exports = router;
