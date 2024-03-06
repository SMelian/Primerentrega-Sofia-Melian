const fs = require('fs');
    
    class CarritoManager {
        constructor(cartFilePath) {
            this.cartFilePath = cartFilePath;
            this.cart = this.loadCartData();
        }
    
        loadCartData() {
            try {
                const cartData = fs.readFileSync(this.cartFilePath, 'utf-8');
                return JSON.parse(cartData);
            } catch (error) {
                // If file doesn't exist or cannot be read, return an empty array
                return [];
            }
        }
    
        saveCartData() {
            try {
                fs.writeFileSync(this.cartFilePath, JSON.stringify(this.cart, null, 2));
            } catch (error) {
                console.error('Error writing cart data:', error);
            }
        }

    addToCart(productId) {
//verificar que el producto no este en el array nuevo
        const existingProductIndex = this.cart.findIndex(item => item.productId === productId);
//si esta, incrementa
        if (existingProductIndex !== -1) {
       
            this.cart[existingProductIndex].quantity++;
        } else {
//sino esta 1           
            this.cart.push({ productId, quantity: 1 });
        }
        this.saveCartData();
    }

    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.productId !== productId);
        this.saveCartData();
    }
    
}

module.exports = CarritoManager;
