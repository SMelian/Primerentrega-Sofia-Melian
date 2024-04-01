const mongoose = require('mongoose');

const cartColl ="Productos"

const cartSchema = new mongoose.Schema({
  title: String,
  price: Number,
  code: String,
  stock: Number,
},{
    timestamps:true
});

//module.export const modeloProductos = mongoose.model(productColl,productSchema)
module.exports = mongoose.model(cartColl, cartSchema);