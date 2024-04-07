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

   /*    VIEJO  async addToCart(productId) {
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

*/

async addToCart(cartId, productId, title) {
    try {
        // Check if a cart with the given ID exists
        let cart = await modeloCart.findById(cartId);

        // If cart doesn't exist, create a new one with the provided title or a default title
        if (!cart) {
            const cartData = { products: [] };
            if (title) {
                cartData.title = title;
            } else {
                cartData.title = 'Default Cart';
            }
            cart = await modeloCart.create(cartData);
        }

        // Find the product by productId in the productos collection
        const product = await modeloProductos.findById(productId).lean();

        if (!product) {
            console.error('Product not found in productos collection');
            return;
        }

        // Add the product to the cart
        cart.products.push(productId);
        await cart.save();

        console.log('Product added to cart successfully');
    } catch (error) {
        console.error('Error adding product to cart:', error);
        throw error; // Rethrow the error to handle it in the router
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
