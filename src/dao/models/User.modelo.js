const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: String,
    age: Number,
    password: String,
    role: { type: String, enum: ['user', 'admin'], default: 'user' }

});

const User = mongoose.model('User', userSchema);

module.exports = User;
