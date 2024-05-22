//const fs = require('fs');
const modeloCart = require ('./dao/models/cart.modelo')
const modeloProductos = require('./dao/models/productos.modelo'); 

    class CarritoManager {
        constructor(cartFilePath) {
    
        }
    
        async loadCartData() {
            try {
                const cart = await modeloCart.find().populate('products.product').lean();
                return cart;
            } catch (error) {
                console.error('Error loading cart data:', error);
                throw error;
            }
        }
    
        async addToCart(cartId, productId, title) {
            try {
                let cart = await modeloCart.findById(cartId);
    
                if (!cart) {
                    cart = await modeloCart.create({ title: title || 'Default Cart', products: [] });
                }
    
                const product = await modeloProductos.findById(productId);
                if (!product) {
                    console.error('Product not found');
                    return;
                }
    
                const productInCart = cart.products.find(p => p.product.equals(productId));
                if (productInCart) {
                    productInCart.quantity += 1;
                } else {
                    cart.products.push({ product: productId, quantity: 1 });
                }
    
                await cart.save();
                console.log('Product added to cart successfully');
            } catch (error) {
                console.error('Error adding product to cart:', error);
                throw error;
            }
        }
    
        async deleteMany() {
            try {
                const result = await modeloCart.deleteMany();
                return result;
            } catch (error) {
                console.error('Error deleting carts:', error);
                throw error;
            }
        }
    
        async removeFromCart(cartId, productId) {
            try {
                const cart = await modeloCart.findById(cartId);
                if (!cart) {
                    console.error('Cart not found');
                    return;
                }
    
                const productIndex = cart.products.findIndex(p => p.product.equals(productId));
                if (productIndex !== -1) {
                    cart.products.splice(productIndex, 1);
                }
    
                await cart.save();
                console.log('Product removed from cart successfully');
            } catch (error) {
                console.error('Error removing product from cart:', error);
                throw error;
            }
        }
    
        async updateCart(cartId, products) {
            try {
                const cart = await modeloCart.findById(cartId);
                if (!cart) {
                    console.error('Cart not found');
                    return;
                }
    
                cart.products = products.map(product => ({
                    product: product.productId,
                    quantity: product.quantity
                }));
    
                await cart.save();
                console.log('Cart updated successfully');
            } catch (error) {
                console.error('Error updating cart:', error);
                throw error;
            }
        }
    }
    
    module.exports = CarritoManager;