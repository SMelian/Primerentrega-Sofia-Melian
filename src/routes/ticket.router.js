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

        if (!usuario.cartId) throw new Error('Carrito no encontrado para el usuario');

        const carrito = await Cart.findById(usuario.cartId).populate('products');
        if (!carrito) throw new Error('Carrito no encontrado');

 
        if (!carrito.products || carrito.products.length === 0) throw new Error('El carrito está vacío');

      
        const productos = carrito.products.map(product => ({
            name: product.title, 
            quantity: 1 
        }));

        
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

