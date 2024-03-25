const { Router } = require("express");

const router = Route

router.get('/', async (req, res) => {
    try {
        let productos = await pm.getProducts();
        let limit = req.query.limit;
        if (limit && limit > 0) {
            productos = productos.slice(0, limit);
        }
        res.render('index', { pageTitle: 'Lista de Productos', productos }); // Render the 'index' view with the list of products
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
  });

  module.exports = router;