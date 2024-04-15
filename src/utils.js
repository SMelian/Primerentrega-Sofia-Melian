const path = require("path")
const rutaProductos = path.join (__dirname,"src","productos.json")
 
const bcrypt = require('bcrypt');


const createHash = async (password) => {
    const saltRounds = 10; // Number of salt rounds
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
}

const isValidPassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
}

module.exports = {
    isValidPassword,
    createHash,
    rutaProductos
};