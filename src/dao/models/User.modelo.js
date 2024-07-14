const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: String,
    age: Number,
    password: String,
    role: { type: String, enum: ['user', 'admin','premium'], default: 'user' },
    cartId: { type: mongoose.Schema.Types.ObjectId, ref: 'Carrito' },  // Referencia al carrito del usuario
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    documents: [{
        name: String,
        reference: String
    }],
    last_connection: Date
});

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
