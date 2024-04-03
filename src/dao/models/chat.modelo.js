const mongoose = require('mongoose');

const mensajeColl="Mensaje";

const mensajeSchema = new mongoose.Schema({
  nombre: String,
  mensaje: String,
},
{
timestamps:true,
});


module.exports = mongoose.model(mensajeColl,mensajeSchema);

