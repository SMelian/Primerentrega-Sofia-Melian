const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const cartColl = "Carrito";

const cartSchema = new mongoose.Schema({
  title: { type: String, required: true }, // Título del carrito
  products: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Productos' },
    quantity: { type: Number, required: true, default: 1 }
  }]
}, {
  timestamps: true
});

cartSchema.plugin(mongoosePaginate);

module.exports = mongoose.model(cartColl, cartSchema);
