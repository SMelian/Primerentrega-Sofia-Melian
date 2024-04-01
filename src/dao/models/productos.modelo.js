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

module.exports = mongoose.model(productColl,productSchema);
