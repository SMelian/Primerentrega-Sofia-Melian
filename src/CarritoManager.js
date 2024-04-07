//const fs = require('fs');
const modeloCart = require ('./dao/models/cart.modelo')
const modeloProductos = require('./dao/models/productos.modelo'); 

    class CarritoManager {
        constructor(cartFilePath) {
            //this.cartFilePath = cartFilePath;
           // this.cart = this.loadCartData();
        }
    
       async loadCartData() {
            try {
               // const cartData = fs.readFileSync(this.cartFilePath, 'utf-8');
               const cart = await modeloCart.find().lean();
                return cart;
                
            } catch (error) {
                console.error("Error al obtener el producto por id:", error);
            }
        }
    
       async saveCartData() {
            try {
                //fs.writeFileSync(this.cartFilePath, JSON.stringify(this.cart, null, 2));
               // await CartModel.deleteMany(); // Es una estrategia pero no se si limpiar el carrito antes de guardar los nuevos datos es buena idea-Investigar.
                await modeloCart.insertMany(cartItems).lean();
            } catch (error) {
                console.error('Error writing cart data:', error);
            }
        }

        async addToCart(productId) {
            try {
                // Find the product by productId in the productos collection
                const product = await modeloProductos.findById(productId).lean();
    
                if (!product) {
                    console.error('Product not found in productos collection');
                    return;
                }
    
                // Find the product by productId in the cart collection
                const existingProduct = await modeloCart.findById(productId).lean();
    
                if (existingProduct) {
                    // If the product exists in the cart, increment its quantity
                    existingProduct.quantity++;
                    await modeloCart.findByIdAndUpdate(existingProduct._id, { quantity: existingProduct.quantity });
                } else {
                    // If the product doesn't exist in the cart, create a new entry
                    await modeloCart.create({ _id: productId, title: product.title, description: product.description, quantity: 1 });
                }
            } catch (error) {
                console.error('Error adding product to cart:', error);
            }
        }


    async deleteMany () {
        try{
            const cart = await modeloCart.find().lean();
            if (!cart) {
                console.log("no ha carrito disponible");
                return;
            }
            await modeloCart.deleteMany();
        }catch (error) {
            console.error('Error removing carts:', error);
            throw error;
        }
    }

    async removeFromCart(cartId) {
        try {
            // Find the product in the cart based on its ID and cartId
            const product = await modeloCart.findOne({ _id: cartId }).lean();
    
            if (!product) {
                console.error('Product not found in cart');
                return;
            }
    
            // Remove the product from the cart
           // await modeloCart.findByIdAndRemove(cartId);
            await modeloCart.deleteOne({ _id: cartId });
    
        } catch (error) {
            console.error('Error removing product from cart:', error);
            throw error;
        }
    }
    

    async updateCart(cartId, products) {
        try {
        
            // Add the new products to the cart
            const productsToAdd = products.map(product => ({
                cartId: cartId,
                title: product.title,
                description: product.description
            }));
            await modeloCart.insertMany(productsToAdd);
        } catch (error) {
            console.error('Error updating cart:', error);
            throw error;
        }
    }
    

}

module.exports = CarritoManager;
