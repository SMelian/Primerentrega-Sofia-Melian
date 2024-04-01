const mongoose = require('mongoose');

const mensajeSchema = new mongoose.Schema({
  nombre: String,
  mensaje: String
});

const Mensaje = mongoose.model('Mensaje', mensajeSchema);

module.exports = Mensaje;
