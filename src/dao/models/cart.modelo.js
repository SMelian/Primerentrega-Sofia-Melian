const mongoose = require('mongoose');
const modeloProductos = require('./productos.modelo'); 
const mongoosePaginate = require('mongoose-paginate-v2');


const cartColl ="Carrito"

const cartSchema = new mongoose.Schema({
  // Define las propiedades del carrito
  title: { type: String, required: true }, // Título del carrito
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Producto' }] // Array de productos en el carrito
},{
    timestamps:true
});

cartSchema.plugin(mongoosePaginate);
//module.export const modeloProductos = mongoose.model(productColl,productSchema)
module.exports = mongoose.model(cartColl, cartSchema);