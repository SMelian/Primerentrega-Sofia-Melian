const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

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

productSchema.plugin(mongoosePaginate);
module.exports = mongoose.model(productColl,productSchema);
