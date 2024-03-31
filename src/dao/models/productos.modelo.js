const mongoose = require('mongoose');

const productColl ="Productos"

const productSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  thumbnail: String,
  code: String,
  stock: Number,
},{
    timestamps:true
});

//module.export const modeloProductos = mongoose.model(productColl,productSchema)
module.exports = mongoose.model(productColl, productSchema);
