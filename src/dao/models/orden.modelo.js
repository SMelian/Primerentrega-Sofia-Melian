// ticketOrden.modelo.js
const mongoose = require('mongoose');

const ticketOrdenSchema = new mongoose.Schema({
  numeroOrden: { type: Number, required: true },
  negocio: { type: String, required: true },
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Referencia al usuario
  productos: [{ type: String, required: true }]  // Lista de productos en formato de cadena
},{
    timestamps: true
});

const TicketOrden = mongoose.model('TicketOrden', ticketOrdenSchema);

module.exports = TicketOrden;
