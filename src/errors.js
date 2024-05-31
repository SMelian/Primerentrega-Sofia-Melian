const errors = {
    PRODUCT_NOT_FOUND: {
        message: 'Product not found',
        statusCode: 404
    },
    CART_NOT_FOUND: {
        message: 'Cart not found',
        statusCode: 404
    },
    USER_NOT_FOUND: {
        message: 'User not found',
        statusCode: 404
    },
};

class CustomError extends Error {
    constructor(errorType) {
        super(errorType.message);
        this.statusCode = errorType.statusCode;
    }
}

module.exports = { errors, CustomError };
