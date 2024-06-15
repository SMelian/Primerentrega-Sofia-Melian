const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const productColl ="Productos"

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: Number,
  thumbnail: String,
  code: String,
  stock: Number,
  owner: { type: String, default: 'admin' }
},{
    timestamps:true
});

productSchema.plugin(mongoosePaginate);

module.exports = mongoose.model(productColl,productSchema);
