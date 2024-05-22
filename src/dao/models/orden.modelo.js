const mongoose = require('mongoose');

const ticketOrdenSchema = new mongoose.Schema({
    numeroOrden: { type: String, required: true },
    negocio: { type: String, required: true },
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    productos: [{
        name: { type: String, required: true },
        quantity: { type: Number, required: true }
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('TicketOrden', ticketOrdenSchema);

