const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: String,
    age: Number,
    password: String,
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    cartId: { type: mongoose.Schema.Types.ObjectId, ref: 'Carrito' }  // Referencia al carrito del usuario

});

const User = mongoose.model('User', userSchema);

module.exports = User;
