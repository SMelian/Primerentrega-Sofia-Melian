const { Router } = require('express');
const generateMockProducts = require('../mockingProduct');

const router = Router();

router.get('/mockingproducts', (req, res) => {
    const products = generateMockProducts();
    res.json(products);
});

module.exports = router;
