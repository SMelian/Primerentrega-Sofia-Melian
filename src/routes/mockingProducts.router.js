const { Router } = require('express');
const generateMockProducts = require('../mockingProduct');
const logger = require('../logger'); 


const router = Router();

router.get('/mockingproducts', (req, res) => {
    const products = [];

    for (let i = 0; i < 100; i++) {
        products.push({
            title: faker.commerce.productName(),
            description: faker.commerce.productDescription(),
            price: faker.commerce.price(),
            category: faker.commerce.department(),
            image: faker.image.imageUrl(),
            stock: faker.random.number({ min: 1, max: 100 })
        });
    }

    logger.info('Generated 100 mock products');
    res.status(200).json(products);
});

module.exports = router;