const TicketOrden = require('./ticketOrden.modelo');
const User = require('./dao/models/User.modelo');
const Cart = require('./dao/models/cart.modelo');
const Producto = require('./dao/models/productos.modelo'); 

const crearTicketOrden = async (userId, numeroOrden, negocio) => {
  try {
    // buscar el usuario
    const usuario = await User.findById(userId).populate('cartId');
    if (!usuario) throw new Error('Usuario no encontrado');

    // trae los productos del carrito
    const carrito = await Cart.findById(usuario.cartId).populate('products');
    if (!carrito) throw new Error('Carrito no encontrado');

    const productos = carrito.products.map(producto => producto.name);

    // en teoria crea el ticket de orden
    const nuevoTicket = new TicketOrden({
      numeroOrden,
      negocio,
      usuario: userId,
      productos
    });

    await nuevoTicket.save();
    console.log("Ticket de orden generado con éxito:", nuevoTicket);
  } catch (error) {
    console.error("Error al generar el ticket de orden:", error);
  }
};

crearTicketOrden(userId, numeroOrden, negocio);

