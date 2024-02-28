class CarritoManager {
    constructor() {
        this.cart = []; 
    }

    getCart() {
        return this.cart;
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
    }

    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item !== productId);
    }
}

module.exports = CarritoManager;
